import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { InterviewSession } from '@/models/InterviewSession';

// ✅ Clean, no unnecessary imports
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();

   const  { id } = await params;

  try {
    const session = await InterviewSession.findById(id);

    if (!session) {
      return NextResponse.json({ success: false, error: 'Session not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, session });
  } catch (err) {
    console.error('Error fetching session:', err);
    return NextResponse.json({ success: false, error: 'Failed to retrieve interview session.' }, { status: 500 });
  }
}
