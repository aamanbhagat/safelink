import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { config } from "@/lib/config";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: `${config.site.name} - ${config.site.tagline}`,
  description: "Create monetized short links in seconds. Simple, fast, and secure link redirection service.",
  robots: {
    index: false, // Don't index redirect pages
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Monetag Anti-AdBlock Script (optional) */}
        {/* Add your Monetag scripts here */}
      </head>
      <body className={`${geist.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
