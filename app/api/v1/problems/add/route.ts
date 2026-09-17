import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { addProblemSchema } from '@/lib/validations/problem';
import { problems } from '@/lib/db/schema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = addProblemSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { title, description, difficulty } = parsed.data;

    const existingProblem = await db.select().from(problems).where(eq(problems.title, title));

    if (existingProblem.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Problem already exists',
        },
        { status: 400 }
      );
    }

    const problem = await db
      .insert(problems)
      .values({ title, description, difficulty })
      .returning();

    return NextResponse.json(
      {
        success: true,
        message: 'Problem added successfully',
        data: problem,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding problem:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
