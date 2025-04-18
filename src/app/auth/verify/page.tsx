'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SubmitButton, AuthFormWrapper } from '@/components/ui/AuthButton';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Navbar from '@/components/Navigation/navbar';
export default function VerifyPage() {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      console.log("✅ Email from URL:", emailParam);
      setEmail(emailParam);
    } else {
      console.warn("❌ Email param missing in URL");
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Email is missing. Try signing up again.');
      return;
    }

    setLoading(true);
    const res = await fetch('/api/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ otp, email }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      toast.success('OTP verified! You can now login.');
      router.push('/auth/login');
    } else {
      toast.error(data.message || 'OTP verification failed');
    }
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-br  from-fuchsia-900 via-zinc-900 to-black  flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-white text-3xl font-bold">InterviewAI</h1>
        </div>

        <AuthFormWrapper title="Verify Your Email" subtitle="Enter the OTP sent to your inbox">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="otp"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="text-center tracking-widest text-lg font-mono"
            />
            <SubmitButton loading={loading} label="Verify" />
          </form>
        </AuthFormWrapper>
      </div>
    </div>
    </>
  );
}
