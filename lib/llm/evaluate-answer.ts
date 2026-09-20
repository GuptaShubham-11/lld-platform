import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { answers, feedbacks, SelectAnswer, SelectFeedback, SelectProblem } from '@/lib/db/schema';
import { userPrompt } from '@/lib/prompts/user';
import { systemPrompt } from '@/lib/prompts/system';
import { llm } from '@/lib/llm/llm';
import { parseLlmFeedback } from '@/lib/llm/llm-response';

const HISTORY_DEPTH = 5;

export type EvaluationOutcome =
  { status: 'completed'; feedback: SelectFeedback } | { status: 'failed'; reason: string };

async function markFailed(answerId: string, reason: string): Promise<EvaluationOutcome> {
  try {
    await db
      .update(answers)
      .set({ evaluationStatus: 'failed', evaluationFailureReason: reason })
      .where(eq(answers.id, answerId));
  } catch (err) {
    console.error('Failed to record failure state for answer', answerId, err);
  }
  return { status: 'failed', reason };
}

export async function evaluateAnswer({
  answerId,
  problem,
  history,
  currentAnswer,
}: {
  answerId: string;
  problem: SelectProblem;
  history: SelectAnswer[];
  currentAnswer: SelectAnswer;
}): Promise<EvaluationOutcome> {
  try {
    await db
      .update(answers)
      .set({ evaluationStatus: 'evaluating' })
      .where(eq(answers.id, answerId));

    const inputPrompt = userPrompt({
      problem,
      history,
      currentAnswer,
      historyDepth: HISTORY_DEPTH,
    });

    let rawResponse;
    try {
      rawResponse = await llm.chat.send({
        chatRequest: {
          model: 'openrouter/free',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: inputPrompt },
          ],
          stream: false,
        },
      });
    } catch (err) {
      console.error('LLM call threw for answer', answerId, err);
      return markFailed(answerId, 'llm_call_failed');
    }

    const content =
      'choices' in rawResponse ? rawResponse.choices?.[0]?.message?.content : undefined;

    const parsed = parseLlmFeedback(content);
    if (!parsed.ok) {
      console.error('LLM output rejected for answer', answerId, parsed.reason, parsed.detail);
      return markFailed(answerId, parsed.reason);
    }

    const feedback = parsed.data;

    let feedbackRow: SelectFeedback | undefined;
    try {
      [feedbackRow] = await db
        .insert(feedbacks)
        .values({
          answerId,
          overallScore: feedback.overallScore,
          rubricFeedback: feedback.rubricFeedback,
          keyTakeaways: feedback.keyTakeaways,
          progressDelta: feedback.progressDelta,
          evaluationStrategy: 'prototype',
        })
        .returning();
    } catch (err) {
      console.error('Failed to persist feedback for answer', answerId, err);
      return markFailed(answerId, 'feedback_persist_failed');
    }

    if (!feedbackRow) {
      return markFailed(answerId, 'feedback_persist_failed');
    }

    try {
      await db
        .update(answers)
        .set({ evaluationStatus: 'completed' })
        .where(eq(answers.id, answerId));
    } catch (err) {
      console.error(
        'Feedback saved but status update to completed failed for answer',
        answerId,
        err
      );
    }

    return { status: 'completed', feedback: feedbackRow };
  } catch (err) {
    console.error('Unhandled error evaluating answer', answerId, err);
    return markFailed(answerId, 'unexpected_error');
  }
}
