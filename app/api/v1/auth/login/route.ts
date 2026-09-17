import { NextRequest, NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';

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

    const existingUser = await db
      .select()
      .from(users)
      .where(and(eq(users.name, name), eq(users.password, password))); // compare name and password

    if (existingUser.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid credentials!',
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'User logged in successfully',
        data: existingUser[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
