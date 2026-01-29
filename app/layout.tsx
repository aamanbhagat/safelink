import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
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
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-GCH4TPWT77"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GCH4TPWT77');
          `}
        </Script>
        {/* Monetag Ad Script */}
        <Script
          src="https://quge5.com/88/tag.min.js"
          data-zone="206568"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${geist.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
