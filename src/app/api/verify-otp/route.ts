import { connectDB } from '@/lib/db';
import User from '@/models/user';
import { NextRequest, NextResponse } from 'next/server';
 // frontend-only

export async function POST(req: NextRequest) {
  await connectDB();

  const { email, otp} = await req.json();

  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json({ success: false, message: 'User not found' });
  }

  if (user.otp !== otp || user.otpExpiry < new Date()) {
    return NextResponse.json({ success: false, message: 'Invalid or expired OTP' });
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();


  return NextResponse.json({
    success: true,
    message: 'OTP verified, user is now verified. Proceed to auto-login.',
  });
}
