import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import ContactMessage from '@/models/ContactMessage';

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
    }

    await ContactMessage.create({ name, email, message });

    return NextResponse.json({ success: true, message: "Message received!" });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
export async function GET(req: NextRequest) {
    await connectDB();
  
    try {
      const apiKey = req.nextUrl.searchParams.get('key');
  
      if (apiKey !== process.env.ADMIN_KEY) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
      }
  
      const messages = await ContactMessage.find().sort({ createdAt: -1 });
  
      return NextResponse.json({ success: true, messages });
    } catch (error) {
      console.error("Contact GET error:", error);
      return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
  }