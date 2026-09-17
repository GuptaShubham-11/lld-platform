import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { authSchema } from '@/lib/validations/auth';
import { users } from '@/lib/db/schema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = authSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { name, password } = parsed.data;

    const existingUser = await db.select().from(users).where(eq(users.name, name));

    if (existingUser.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'User already exists',
        },
        { status: 400 }
      );
    }

    const user = await db.insert(users).values({ name, password }).returning();

    return NextResponse.json(
      {
        success: true,
        message: 'User registered successfully',
        data: user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
