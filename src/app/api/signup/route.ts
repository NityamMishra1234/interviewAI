// app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import User from '@/models/user';
import { sendVerificationEmail } from '@/lib/mail/sendVerificationEmail';

export async function POST(req: Request) {
  await connectDB();

  try {
    const body = await req.json();
const { email, username, password, company } = body;
console.log("📨 Received signup data:", body);
    // Check required fieldss
    if (!email || !username || !password) {
        return NextResponse.json(
          { success: false, message: 'Email, username, and password are required' },
          { status: 400 }
        );
      }
      

    // Check if user/email/username already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email or username already in use' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    // Create new user
    const newUser = new User({
      email,
      username,
      company,
      hashedPassword,
      otp,
      otpExpiry,
      isVerified: false,
    });

    await newUser.save();

    // Send verification email
    await sendVerificationEmail(email, username, otp);

    return NextResponse.json({
      success: true,
      message: 'User registered successfully. Please verify your email.',
    });
  } catch (error) {
    console.error('[SIGNUP_ERROR]', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Try again.' },
      { status: 500 }
    );
  }
}
