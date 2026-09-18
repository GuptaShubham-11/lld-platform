import { NextRequest, NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';

import { db } from '@/lib/db';
import { startSessionSchema } from '@/lib/validations/sessions';
import { practiceSessions } from '@/lib/db/schema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = startSessionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { problemId, userId } = parsed.data;

    const existingSession = await db
      .select()
      .from(practiceSessions)
      .where(and(eq(practiceSessions.id, problemId), eq(practiceSessions.userId, userId)));

    if (existingSession.length > 0) {
      return NextResponse.json(
        {
          success: true,
          message: 'Session started again',
          data: existingSession[0],
        },
        { status: 200 }
      );
    }

    const session = await db.insert(practiceSessions).values({ problemId, userId }).returning();

    return NextResponse.json(
      {
        success: true,
        message: 'Session started successfully',
        data: session,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error session:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
