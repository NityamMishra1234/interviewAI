'use client';

import Footer from '@/components/footer/Footer';
import Navbar from '@/components/Navigation/navbar';
// Remove the direct import of Player
// import { Player } from '@lottiefiles/react-lottie-player';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import dynamic from 'next/dynamic'; // Import dynamic

// Dynamically import the Player component, disable SSR
const DynamicPlayer = dynamic(
  () => import('@lottiefiles/react-lottie-player').then((mod) => mod.Player),
  { ssr: false } // This is the key part
);

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // ... (your handleSubmit logic remains the same)
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        toast.error(data.message || 'Something went wrong!');
      }
    } catch (err) {
      toast.error('Server error!');
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-fuchsia-900 via-zinc-900 to-black text-white px-4 py-10 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-2 text-center">Let’s Connect!</h1>
        <p className="text-center text-zinc-300 mb-6">We’re open to collaboration, partnerships, and <span className="text-green-400 font-semibold">investments</span>.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl items-center">
          {/* Use the dynamically imported Player */}
          <DynamicPlayer
            autoplay
            loop
            src="\ContectAnimation.json" // Ensure this path is correct relative to your /public folder
            className="w-full h-80 md:h-96"
          />

          {/* Contact Form */}
          <form
            className="space-y-5 w-full"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
           {/* ... (your form inputs remain the same) ... */}
             <div>
               <label className="block mb-1 text-sm">Name</label>
               <input
                 type="text"
                 required
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
                 required
                 className="w-full px-4 py-2 rounded-md bg-zinc-800 text-white outline-none"
                 placeholder="your@email.com"
                 value={formData.email}
                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
               />
             </div>

             <div>
               <label className="block mb-1 text-sm">Message</label>
               <textarea
                 required
                 rows={5}
                 className="w-full px-4 py-2 rounded-md bg-zinc-800 text-white outline-none"
                 placeholder="Your message..."
                 value={formData.message}
                 onChange={(e) => setFormData({ ...formData, message: e.target.value })}
               />
             </div>

             <button
               type="submit"
               className="w-full bg-blue-600 hover:bg-blue-700 transition-all px-4 py-2 rounded-md font-semibold"
               disabled={loading}
             >
               {loading ? 'Sending...' : 'Send Message'}
             </button>
          </form>
        </div>

        {/* Social Media */}
        {/* ... (your social media links remain the same) ... */}
         <div className="mt-10 text-center space-y-3">
           <p className="text-lg font-semibold">Or reach me directly:</p>
           <div className="flex gap-4 justify-center text-blue-400 text-xl">
             <Link href="mailto:nityam1111@gmail.com" target="_blank">Email</Link>
             <Link href="https://www.linkedin.com/in/nityam-mishra-043295290/" target="_blank">LinkedIn</Link>
             <Link href="https://github.com/NityamMishra1234" target="_blank">GitHub</Link>
             <Link href="https://www.instagram.com/i.am.nityam/" target="_blank">Instagram</Link>
           </div>
           <p className="text-sm mt-3 text-zinc-400">Motihari, Bihar, India</p>
         </div>
      </div>
      <Footer />
    </>
  );
}