// app/api/interview/start/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { InterviewSession } from '@/models/InterviewSession';
import { generateConversationalQuestions } from '@/lib/geminiHelpers';

export async function POST(req: Request) {
  await connectDB();
  const { name, email, phone, topic, experienceLevel } = await req.json();

  try {
    // Generate conversational question set
    const questions = await generateConversationalQuestions(topic, experienceLevel);

    // Format for DB
    const responses = questions.map((q: string) => ({ question: q }));

    const session = await InterviewSession.create({
      name,
      email,
      phone,
      topic,
      experienceLevel,
      responses,
      totalScore: 0,
      status: 'in-progress',
    });

    return NextResponse.json({
      success: true,
      sessionId: session._id,
      question: `Hi ${name}, ${responses[0].question}`,
    });
  } catch (err) {
    console.error('Error creating session:', err);
    return NextResponse.json({ success: false, error: 'Failed to start interview.' }, { status: 500 });
  }
}
