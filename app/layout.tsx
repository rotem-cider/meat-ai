import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://meat-ai.vercel.app"),
  title: "Meat & AI — Meetup Organizer",
  description: "Organize your Meat & AI meetups. RSVP, bring meat, talk AI.",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Meat & AI — Meetup Organizer",
    description: "Where good code meets great cuts. Propose a meetup, bring some meat, talk some AI.",
    type: "website",
    images: ["/api/og"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Meat & AI — Meetup Organizer",
    description: "Where good code meets great cuts. Propose a meetup, bring some meat, talk some AI.",
    images: ["/api/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-50 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
