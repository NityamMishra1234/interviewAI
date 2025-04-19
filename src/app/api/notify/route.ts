import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';  // Your database connection helper
import Notify from '@/models/Notify';

export async function POST(req: Request) {
  await connectDB();
  
  try {
    const { email } = await req.json();
    
    // Validation for email
    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, message: 'Invalid email address' }, { status: 400 });
    }
    
    // Check if email already exists
    const alreadyExists = await Notify.findOne({ email });
    if (alreadyExists) {
      return NextResponse.json({ success: true, message: 'Already subscribed' }, { status: 200 });
    }
    
    // Create new subscription
    await Notify.create({ email });
    return NextResponse.json({ success: true, message: 'Thanks for signing up!' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
