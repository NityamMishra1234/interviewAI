import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { InterviewSession } from '@/models/InterviewSession';
import { evaluateAnswers } from '@/lib/geminiHelpers';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { sessionId, answers } = await req.json();

    console.log("📩 Received payload:", { sessionId, answers });

    if (!sessionId || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json({ error: 'Invalid input. sessionId and answers are required.' }, { status: 400 });
    }

    // Run evaluation
    const { totalScore, feedback } = await evaluateAnswers(answers);

    // Update the InterviewSession
    const updated = await InterviewSession.findByIdAndUpdate(
      sessionId,
      {
        responses: [],
        totalScore,
        feedback,
        status: 'completed',
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Session not found or update failed.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      totalScore,
      feedback,
    });
  } catch (err: unknown) {
    console.error('🚨 Interview submission error:', err);
    return NextResponse.json({ error: 'Evaluation failed. Please try again later.' }, { status: 500 });
  }
}
