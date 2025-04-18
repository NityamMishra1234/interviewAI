'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Facebook,
  Instagram,
  Github,
  Linkedin,
} from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/docs', label: 'Documentation' },
  { href: '/contact', label: 'Contact' },
]

const socialLinks = [
  { href: 'https://facebook.com', icon: <Facebook size={20} />, name: 'Facebook' },
  { href: 'https://instagram.com', icon: <Instagram size={20} />, name: 'Instagram' },
  { href: 'https://linkedin.com', icon: <Linkedin size={20} />, name: 'LinkedIn' },
  { href: 'https://github.com/yourhandle', icon: <Github size={20} />, name: 'GitHub' },
]

export default function Footer() {
  const pathname = usePathname()

  return (
    <footer className="bg-gradient-to-br  from-fuchsia-900 via-zinc-900 to-black text-white px-6 py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-center">

        {/* Left: Brand */}
        <div>
          <h2 className="text-xl font-bold">InterviewAI</h2>
          <p className="text-sm text-zinc-400 mt-2">
            Empowering smart hiring and mock interviews with AI.
          </p>
        </div>

        {/* Center: Navigation Links */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition hover:text-blue-400 ${
                pathname === link.href ? 'text-blue-400 font-semibold' : 'text-zinc-300'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right: Social Media */}
        <div className="flex flex-col md:items-end items-center gap-3">
          <div className="flex gap-4">
            {socialLinks.map((social) => (
              <Link
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="text-zinc-300 hover:text-blue-400 transition"
              >
                {social.icon}
              </Link>
            ))}
          </div>
          <p className="text-xs text-zinc-500 mt-2 text-center md:text-right">
            &copy; {new Date().getFullYear()} InterviewAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
