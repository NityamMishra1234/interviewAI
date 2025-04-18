"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navigation/navbar";
import Footer from "@/components/footer/Footer";
export default function Home() {
  return (
    <>
    <Navbar/>
    <main className="min-h-screen bg-gradient-to-br  from-fuchsia-900 via-zinc-900 to-black text-white flex flex-col items-center justify-center px-4">
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
          className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl hover:shadow-2xl transition border border-white/20"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-4">You're a company?</h2>
          <p className="text-gray-300 mb-6">
            Hire smarter with AI-powered interviews. Create your own custom interview flow, add questions, and generate a unique link for candidates.
          </p>
          <Link href="/auth/login">
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full transition shadow-lg">
              Login to Hire
            </button>
          </Link>
        </motion.div>

        {/* Right Card - Candidate */}
        <motion.div
          className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl hover:shadow-2xl transition border border-white/20"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-4">Want a mock interview?</h2>
          <p className="text-gray-300 mb-6">
            Prepare for your dream job with smart mock interviews and get instant feedback. Practice with real-time AI guidance.
          </p>
          <Link href="/mock/start">
            <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-full transition shadow-lg">
              Start Mock Interview
            </button>
          </Link>
        </motion.div>
      </div>
    </main>
    <Footer/>
    </>
  );
}
