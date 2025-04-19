'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navigation/navbar';
import Footer from '@/components/footer/Footer';
import { Box } from '@mui/material';

export default function Home() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleNotify = async () => {
    if (!email.includes('@')) {
      setMessage('Please enter a valid email.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setMessage(data.message);
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
      setEmail('');
    }
  };

  return (
    <>
      <Navbar />
      <Box className="text-center py-3 bg-yellow-500 text-black font-semibold">
        🚧 This is a beta test version. Use only for testing purposes. The full version will be available soon!
      </Box>

      <main className="min-h-screen bg-gradient-to-br from-fuchsia-900 via-zinc-900 to-black text-white flex flex-col items-center justify-center px-4">
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-center mb-36 mt-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          👋 Welcome to InterviewAI
        </motion.h1>

        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-18">
          {/* Left Card - Company */}
          <motion.div
            className="bg-gradient-to-br from-zinc-900 via-fuchsia-900 to-black p-8 rounded-2xl shadow-xl hover:shadow-2xl transition border border-white/10"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-semibold shadow">
                🚧 Coming Soon
              </div>
              <h2 className="text-2xl font-bold text-white">For Companies</h2>
            </div>

            <p className="text-gray-300 mb-4">
              We're building powerful tools for HR teams to hire faster and better with AI-driven mock interviews.
            </p>

            <p className="text-gray-400 text-sm mb-6">
              This feature isn't available just yet — stay tuned for our launch announcement. If you're interested in early access, drop us your email below.
            </p>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full mb-3 px-4 py-2 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            />

            <button
              onClick={handleNotify}
              disabled={loading || !email}
              className={`w-full py-2 rounded-full transition ${
                loading
                  ? 'bg-gray-700 opacity-50 cursor-wait'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {loading ? 'Submitting...' : 'Notify Me on Launch'}
            </button>

            {message && (
              <p className="mt-3 text-sm text-center text-green-400">{message}</p>
            )}
          </motion.div>

          {/* Right Card - Candidate */}
          <motion.div
  className="bg-gradient-to-br from-zinc-900 via-fuchsia-900 to-black backdrop-blur-lg p-8 rounded-2xl shadow-xl hover:shadow-2xl transition border border-white/20"
  initial={{ opacity: 0, x: 50 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: 0.4, duration: 0.6 }}
>
  <h2 className="text-2xl font-bold mb-4 text-gradient bg-clip-text text-transparent">
    Want to ace your mock interview?
  </h2>

  <p className="text-gray-300 mb-6">
    Unlock your full potential with AI-powered mock interviews. Get instant feedback, track your progress, and build confidence for your dream job.
  </p>

  <div className="flex flex-col items-center gap-4">
    <Link href="/mock/start">
      <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-full transition shadow-lg transform hover:scale-105">
        Start Mock Interview
      </button>
    </Link>

    <p className="text-sm text-gray-400 mt-4">
      Get personalized interview questions and tips tailored to your career goals.
    </p>
  </div>
</motion.div>

        </div>
      </main>

      <Footer />
    </>
  );
}
