import { NextRequest, NextResponse } from 'next/server';
import { eq, and, desc } from 'drizzle-orm';
import { after } from 'next/server';
import { db } from '@/lib/db';
import { addAnswerSchema } from '@/lib/validations/answer';
import { addFeedbackSchema } from '@/lib/validations/feedback';
import { answers, feedbacks, problems, SelectAnswer, SelectProblem, users } from '@/lib/db/schema';
import { generateSubmissionHash } from '@/lib/generate-random';
import { userPrompt } from '@/lib/prompts/user';
import { llm } from '@/lib/llm';
import { systemPrompt } from '@/lib/prompts/system';
import { withTimeout } from '@/lib/with-timeout';

const HISTORY_DEPTH = 5;

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: sessionId } = await params;

    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: 'Session ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const parsed = addAnswerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, errors: parsed.error.flatten() }, { status: 400 });
    }

    const { skeletonCode, attemptStatus, durationSec, tradeOffRationale, name, password } =
      parsed.data;

    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(and(eq(users.name, name), eq(users.password, password)))
      .limit(1);

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const session = await db.query.practiceSessions.findFirst({
      where: {
        id: sessionId,
        userId: user.id,
      },
      with: {
        problem: true,
        answers: {
          orderBy: (a, { desc: descOp }) => [descOp(a.version)],
          limit: HISTORY_DEPTH,
        },
      },
    });

    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Session not found for this user/problem' },
        { status: 404 }
      );
    }

    const priorAnswers = session.answers ?? [];
    const nextVersion = priorAnswers.length > 0 ? Number(priorAnswers[0].version) + 1 : 1;

    const submissionHash = generateSubmissionHash(skeletonCode);
    const duplicate = await db
      .select({ id: answers.id })
      .from(answers)
      .where(and(eq(answers.sessionId, sessionId), eq(answers.submissionHash, submissionHash)))
      .limit(1);

    if (duplicate.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            'You have already submitted this exact solution. Try changing your design before resubmitting.',
        },
        { status: 400 }
      );
    }

    const [newAnswer] = await db
      .insert(answers)
      .values({
        sessionId,
        userId: user.id,
        problemId: session.problemId,
        skeletonCode,
        tradeOffRationale,
        submissionHash,
        attemptStatus,
        durationSec,
        version: nextVersion,
        evaluationStatus: 'pending',
      })
      .returning();

    if (!newAnswer) {
      return NextResponse.json(
        { success: false, message: 'Failed to add answer' },
        { status: 500 }
      );
    }

    const evalPromise = evaluateAnswer({
      answerId: newAnswer.id,
      problem: session.problem as SelectProblem,
      history: priorAnswers,
      currentAnswer: newAnswer,
    });

    const result = await withTimeout(evalPromise);

    if (result === 'TIMEOUT') {
      after(() => evalPromise);

      return NextResponse.json(
        {
          success: true,
          message: 'Submission received. Evaluation is taking longer than usual.',
          data: {
            answerId: newAnswer.id,
            version: newAnswer.version,
            evaluationStatus: 'evaluating',
          },
        },
        { status: 202 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Evaluated successfully',
        data: { answerId: newAnswer.id, version: newAnswer.version, feedback: result },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting answer:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

async function evaluateAnswer({
  answerId,
  problem,
  history,
  currentAnswer,
}: {
  answerId: string;
  problem: SelectProblem;
  history: SelectAnswer[];
  currentAnswer: SelectAnswer;
}) {
  await db.update(answers).set({ evaluationStatus: 'evaluating' }).where(eq(answers.id, answerId));

  let rawText: string;
  try {
    const inputPrompt = userPrompt({
      problem,
      history,
      currentAnswer,
      historyDepth: HISTORY_DEPTH,
    });

    const rawResponse = await llm.interactions.create({
      model: 'gemini-3.8-flash',
      input: `${systemPrompt}\n\n${inputPrompt}`,
    });

    if (!rawResponse.output_text) throw new Error('empty_llm_response');
    rawText = rawResponse.output_text;
  } catch (err) {
    console.error('LLM call failed for answer', answerId, err);
    await db
      .update(answers)
      .set({ evaluationStatus: 'failed', evaluationFailureReason: 'llm_call_failed' })
      .where(eq(answers.id, answerId));
    return;
  }

  let parsedFeedback: unknown;
  try {
    parsedFeedback = JSON.parse(rawText);
  } catch (err) {
    console.error('LLM returned non-JSON for answer', answerId, err);
    await db
      .update(answers)
      .set({ evaluationStatus: 'failed', evaluationFailureReason: 'malformed_llm_output' })
      .where(eq(answers.id, answerId));
    return;
  }

  const validated = addFeedbackSchema.safeParse(parsedFeedback);
  if (!validated.success) {
    console.error(
      'LLM output failed schema validation for answer',
      answerId,
      validated.error.flatten()
    );
    await db
      .update(answers)
      .set({ evaluationStatus: 'failed', evaluationFailureReason: 'schema_validation_failed' })
      .where(eq(answers.id, answerId));
    return;
  }

  const feedback = validated.data;

  await db.transaction(async (tx) => {
    await tx.insert(feedbacks).values({
      answerId,
      overallScore: feedback.overallScore,
      rubricFeedback: feedback.rubricFeedback,
      evaluationStrategy: 'prototype',
    });
    await tx.update(answers).set({ evaluationStatus: 'completed' }).where(eq(answers.id, answerId));
  });
}
