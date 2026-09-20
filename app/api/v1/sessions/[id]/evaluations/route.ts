// app/api/sessions/[id]/answers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';
import { after } from 'next/server';
import { db } from '@/lib/db';
import { addAnswerSchema } from '@/lib/validations/answer';
import { answers, SelectProblem } from '@/lib/db/schema';
import { generateSubmissionHash } from '@/lib/generate-random';
import { authenticateUser } from '@/lib/llm/auth';
import { evaluateAnswer } from '@/lib/llm/evaluate-answer';
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

    const user = await authenticateUser(name, password);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    const session = await db.query.practiceSessions.findFirst({
      where: { id: sessionId, userId: user.id },
      with: {
        problem: true,
        answers: { orderBy: (a, { desc }) => [desc(a.version)], limit: HISTORY_DEPTH },
      },
    });
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Session not found for this user' },
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
          message: 'Identical solution already submitted. Change your design before resubmitting.',
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

    const raced = await withTimeout(evalPromise);

    if (raced === 'TIMEOUT') {
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

    if (raced.status === 'failed') {
      return NextResponse.json(
        {
          success: true,
          message: 'Submission saved, but evaluation failed.',
          data: {
            answerId: newAnswer.id,
            version: newAnswer.version,
            evaluationStatus: 'failed',
            reason: raced.reason,
          },
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Evaluated successfully',
        data: { answerId: newAnswer.id, version: newAnswer.version, feedback: raced.feedback },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting answer:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
