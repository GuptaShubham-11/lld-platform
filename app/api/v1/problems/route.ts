import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { problems } from '@/lib/db/schema';

export async function GET(request: NextRequest) {
  try {
    const questions = await db.select().from(problems);

    return NextResponse.json(
      {
        success: true,
        message: 'Problem fetched successfully',
        data: questions,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching problem:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
