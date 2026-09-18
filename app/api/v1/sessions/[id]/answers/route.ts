import { NextRequest, NextResponse } from 'next/server';
import { eq, and, or } from 'drizzle-orm';

import { db } from '@/lib/db';
import { addAnswerSchema } from '@/lib/validations/answer';
import { answers } from '@/lib/db/schema';
import { generateSubmissionHash } from '@/lib/generate-random';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json();
    const { id: sessionId } = await params;

    if (!sessionId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Session ID is required',
        },
        { status: 400 }
      );
    }

    const parsed = addAnswerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const {
      problemId,
      userId,
      skeletonCode,
      attemptStatus,
      durationSec,
      tradeOffRationale,
      version,
    } = parsed.data;

    const submissionHash = generateSubmissionHash(skeletonCode);

    const existingAnswer = await db
      .select()
      .from(answers)
      .where(
        or(
          eq(answers.submissionHash, submissionHash),
          and(
            eq(answers.problemId, problemId),
            eq(answers.userId, userId),
            eq(answers.version, version)
          )
        )
      );

    if (existingAnswer.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            'You have already submitted this exact solution. Try changing your code before resubmitting.',
        },
        { status: 400 }
      );
    }

    const answer = await db.insert(answers).values({
      sessionId,
      userId,
      problemId,
      skeletonCode,
      tradeOffRationale,
      submissionHash,
      attemptStatus,
      durationSec,
      version,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Answer added successfully',
        data: answer,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding answer:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
