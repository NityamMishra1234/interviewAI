'use client';

import { motion } from 'framer-motion'
import Link from 'next/link'
import Navbar from '@/components/Navigation/navbar';
import Footer from '@/components/footer/Footer';
export default function AboutPage() {
  return (
    <>
    <Navbar/>
    <div className="bg-gradient-to-br  from-fuchsia-900 via-zinc-900 to-black  text-white min-h-screen px-6 py-16">
      <div className="max-w-5xl mx-auto space-y-14">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
        >
          Welcome to InterviewAI
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="bg-zinc-800 rounded-2xl shadow-xl p-8 text-lg leading-relaxed"
        >
          <h2 className="text-2xl font-bold text-blue-400 mb-4">How It Works</h2>
          <p>
            InterviewAI is a cutting-edge platform designed to streamline your hiring and interview preparation process.
            Companies can create dynamic AI-powered interviews by choosing categories, adding questions, and sharing unique interview links.
            Candidates can experience real-time, voice-enabled mock interviews that are automatically evaluated for insights and feedback.
          </p>
          <ul className="list-disc mt-4 ml-6 space-y-1 text-gray-300">
            <li>Companies can log in and set up interviews in minutes.</li>
            <li>Candidates receive a friendly, human-like interview simulation.</li>
            <li>Each session is timed, scored, and anti-cheating protected.</li>
            <li>Instant results are generated with feedback sent to HR.</li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="bg-zinc-800 rounded-2xl shadow-xl p-8 text-lg leading-relaxed"
        >
          <h2 className="text-2xl font-bold text-pink-400 mb-4">Terms & Conditions</h2>
          <p>
            By using InterviewAI, you agree to our privacy-first policy. We do not sell user data, and all communication is end-to-end encrypted.
            Companies must respect candidate data and interviews are not stored beyond evaluation. Misuse of AI interviews for malicious intent may lead to account suspension.
          </p>
          <ul className="list-disc mt-4 ml-6 space-y-1 text-gray-300">
            <li>All emails must be verified before interview creation or participation.</li>
            <li>AI feedback is automated and unbiased, but always improving.</li>
            <li>Do not share links with unverified or malicious users.</li>
            <li>By accessing this platform, you agree to responsible usage of AI.</li>
          </ul>
        </motion.div>

        <div className="text-center pt-8">
          <Link
            href="/auth/signup"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-all"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  )
}
