import type { Metadata } from "next";

import "./globals.css";
import { Toaster } from 'sonner';
import { Providers } from '@/app/providers';
import ThemeRegistry from "@/theme/ThemeRegistry";



export const metadata: Metadata = {
  title: "Interview AI",
  description: "best online interview preparation tool",
  icons: {
    icon: "/favicon.png",
  },
  keywords: "interview, preparation, AI, online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <ThemeRegistry>
        <Toaster richColors position="top-right" />
        <Providers>{children}</Providers>
        </ThemeRegistry>
      </body>
    </html>
  );
}
