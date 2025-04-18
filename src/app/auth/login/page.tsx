'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { InputField } from '@/components/ui/AuthInput';
import { SubmitButton, AuthFormWrapper } from '@/components/ui/AuthButton';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navigation/navbar';
export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn('credentials', {
      redirect: false,
      callbackUrl: '/dashboard',
      identifire: identifier,
      password,
    });

    setLoading(false);

    if (res?.ok) {
      toast.success('Login successful!');
      router.push('/dashboard');
    } else {
      toast.error('Invalid credentials. Please try again.');
    }

    console.log('🔐 Login result:', res);
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-br  from-fuchsia-900 via-zinc-900 to-black  flex items-center justify-center px-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="text-center mb-6">
          <h1 className="text-white text-3xl font-bold">InterviewAI</h1>
        </div>

        <AuthFormWrapper title="Login" subtitle="Welcome back! Enter your credentials">
          <form onSubmit={handleLogin} className="space-y-4">
            <InputField
              label="Email or Username"
              name="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
            <InputField
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <SubmitButton loading={loading} label="Sign In" />
          </form>

          <p className="text-center text-sm text-gray-900 mt-4">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-blue-600 underline hover:text-gray-300">
              Sign up
            </Link>
          </p>
        </AuthFormWrapper>
      </motion.div>
    </div>
    </>
  );
}
