'use client';

import Footer from '@/components/footer/Footer';
import Navbar from '@/components/Navigation/navbar';
import { Player } from '@lottiefiles/react-lottie-player';
import Link from 'next/link';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-br  from-fuchsia-900 via-zinc-900 to-black text-white px-4 py-10 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-6 text-center">Let’s Connect!</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl items-center">
        {/* Lottie Animation */}
        <Player
          autoplay
          loop
          src="\ContectAnimation.json" // You can replace this with your animation URL or file
          className="w-full h-80 md:h-96"
        />

        {/* Contact Form */}
        <form className="space-y-5 w-full">
          <div>
            <label className="block mb-1 text-sm">Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-md bg-zinc-800 text-white outline-none"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded-md bg-zinc-800 text-white outline-none"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Message</label>
            <textarea
              rows={5}
              className="w-full px-4 py-2 rounded-md bg-zinc-800 text-white outline-none"
              placeholder="Your message..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </div>

          <button
            type="button"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-all px-4 py-2 rounded-md font-semibold"
          >
            Send Message
          </button>
        </form>
      </div>

      {/* Social Media Links */}
      <div className="mt-10 text-center space-y-3">
        <p className="text-lg font-semibold">Or reach me directly:</p>
        <div className="flex gap-4 justify-center text-blue-400 text-xl">
          <Link href="mailto:nityam1111@gmail.com" target="_blank" rel="noopener noreferrer">Email</Link>
          <Link href="https://www.linkedin.com/in/nityam-mishra-043295290/" target="_blank" rel="noopener noreferrer">LinkedIn</Link>
          <Link href="https://github.com/NityamMishra1234" target="_blank" rel="noopener noreferrer">GitHub</Link>
          <Link href="https://www.instagram.com/i.am.nityam/" target="_blank" rel="noopener noreferrer">Instagram</Link>
        </div>
        <p className="text-sm mt-3 text-zinc-400">Motihari, Bihar, India </p>
      </div>
    </div>
    <Footer/>
    </>
  );
}
