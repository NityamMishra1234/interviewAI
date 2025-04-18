// lib/mail/sendVerificationEmail.ts
import { resend } from '../resend';
import VerificationEmail from '@/emails/VerificationEmail';
import { ApiResponse } from '../../../types/ApiResponse';

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'InterviewAI | OTP Verification Code',
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    console.log("📬 Email send result:", result);

    return {
      success: true,
      message: 'Verification email sent successfully',
    };
  } catch (error: Error | unknown) {
    if (error instanceof Error) {
      console.error('❌ Error sending verification email:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        // In case `response` exists in the error object (e.g., in axios errors)
        response: (error),
      });
    } else {
      console.error('❌ Unknown error sending verification email:', error);
    }

    return {
      success: false,
      message: (error instanceof Error ? error.message : 'Failed to send verification email'),
    };
  }
}
