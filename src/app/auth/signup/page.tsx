
'use client';

import { useState } from 'react';
import { InputField } from '@/components/ui/AuthInput';
import { SubmitButton, AuthFormWrapper } from '@/components/ui/AuthButton';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navigation/navbar';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password, company }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setEmail(email);
      setUsername(username);
      const url =router.push(`/auth/verify?email=${email}`);
      console.log(url)
    } else {
      alert(data.message || 'Signup failed');
    }
  };


  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-br  from-fuchsia-900 via-zinc-900 to-black  flex items-center justify-center px-4 relative overflow-hidden">
      {/* Optional floating blur background shape */}
      <div className="absolute w-[600px] h-[600px] bg-purple-500 rounded-full opacity-20 blur-3xl top-[-200px] left-[-200px] z-0"></div>

      <div className="w-full max-w-md z-10">
        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="text-white text-3xl font-bold tracking-tight">InterviewAI</h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <AuthFormWrapper
            title="Create an account"
            subtitle="Enter your details to get started"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField
                label="Email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <InputField
                label="Username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <InputField
                label="Company"
                name="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
              <InputField
                label="Password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <SubmitButton loading={loading} label="Sign Up" />
            </form>

            {/* Redirect to Login */}
            <p className="text-center text-sm text-gray-900 mt-4">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-blue-400 underline hover:text-white transition">
                Login here
              </Link>
            </p>
          </AuthFormWrapper>
        </motion.div>
      </div>
    </div>
    </>
  );
}
