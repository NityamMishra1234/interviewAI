// lib/resend.ts
import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationRequest({ identifier, url }: { identifier: string; url: string }) {
  try {
    await resend.emails.send({
      from: 'noreply@interviewai.io',
      to: identifier,
      subject: 'Sign in to InterviewAI',
      html: `
        <p>Hello,</p>
        <p>Click <a href="${url}">here</a> to sign in to your account.</p>
        <p>This link will expire in 10 minutes.</p>
      `,
    });
  } catch (error) {
    console.error('Resend Error:', error);
    throw new Error('Email could not be sent.');
  }
}
