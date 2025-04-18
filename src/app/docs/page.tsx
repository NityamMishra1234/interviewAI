'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navigation/navbar';
import Footer from '@/components/footer/Footer';
const sections = [
  { id: 'mock-interview', title: 'Mock Interview' },
  { id: 'create-interview', title: 'Create Interview' },
  { id: 'terms', title: 'Terms & Conditions' },
  { id: 'how-it-works', title: 'How It Works' },
];

export default function DocumentationPage() {
  const [activeSection, setActiveSection] = useState('mock-interview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
    <Navbar/>
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br  from-fuchsia-900 via-zinc-900 to-black  text-white">
      {/* Mobile Toggle */}
      <div className="md:hidden p-4 flex justify-between items-center border-b border-gray-700">
        <h2 className="text-xl font-bold">Docs</h2>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-blue-400 border border-blue-400 px-2 py-1 rounded"
        >
          {isSidebarOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          'w-full md:w-64 border-r border-gray-700 p-4 space-y-4 transition-all duration-300',
          !isSidebarOpen && 'hidden md:block'
        )}
      >
        <h2 className="text-xl font-bold mb-4 hidden md:block">Documentation</h2>
        <nav className="space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              className={cn(
                'text-left w-full px-3 py-2 rounded hover:bg-gray-800 transition-colors',
                activeSection === section.id && 'bg-gray-800 text-blue-400'
              )}
              onClick={() => {
                setActiveSection(section.id);
                setIsSidebarOpen(false);
              }}
            >
              {section.title}
            </button>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 max-w-4xl mx-auto">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {activeSection === 'mock-interview' && (
            <section>
              <h1 className="text-2xl font-bold mb-4">Mock Interview</h1>
              <p className="text-gray-300">
                Our AI-powered mock interviews simulate real-world scenarios tailored to your role. Just select a category (Coding, BPO, English, etc.), fill in your name and email, and begin the voice-driven interview. Receive real-time scores, feedback, and suggestions.
              </p>
            </section>
          )}

          {activeSection === 'create-interview' && (
            <section>
              <h1 className="text-2xl font-bold mb-4">Create Interview</h1>
              <p className="text-gray-300">
                As a company, you can register and build your own interview pipeline. Add custom questions or let our AI suggest relevant ones based on the interview type. Share the interview link with candidates to automatically evaluate their responses.
              </p>
            </section>
          )}

          {activeSection === 'terms' && (
            <section>
              <h1 className="text-2xl font-bold mb-4">Terms & Conditions</h1>
              <p className="text-gray-300">
                By using InterviewAI, you agree not to misuse the platform. Interviews may be monitored and logged for accuracy and improvement. All data is handled with respect to privacy, and you retain control of your data.
              </p>
            </section>
          )}

          {activeSection === 'how-it-works' && (
            <section>
              <h1 className="text-2xl font-bold mb-4">How It Works</h1>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>Register as either a company or a candidate.</li>
                <li>Companies create interviews with custom/AI-generated questions.</li>
                <li>Candidates receive a link, start the AI voice-driven interview.</li>
                <li>Responses are evaluated and scored using AI models.</li>
                <li>Companies get detailed performance analytics.</li>
              </ul>
            </section>
          )}
        </motion.div>
      </main>
    </div>
    <Footer/>
    </>
  );
}