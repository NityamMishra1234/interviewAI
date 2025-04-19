// app/api/feedback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Feedback } from '@/models/Feedback';

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const { name, email, topic, feedbackText, score } = body;
  console.log("📨 Received feedback data:", body);

  try {
    const newFeedback = await Feedback.create({ name, email, topic, feedbackText, score });
    return NextResponse.json({ success: true, feedback: newFeedback });
  } catch (err) {
    console.error('Error saving feedback:', err);
    return NextResponse.json({ success: false, error: 'Failed to save feedback.' }, { status: 500 });
  }
}
export async function GET() {
    await connectDB();
  
    try {
      const feedbacks = await Feedback.find().sort({ createdAt: -1 });
      return NextResponse.json({ success: true, feedbacks });
    } catch (err) {
      console.error('Error fetching feedback:', err);
      return NextResponse.json({ success: false, error: 'Failed to fetch feedback.' }, { status: 500 });
    }
  }