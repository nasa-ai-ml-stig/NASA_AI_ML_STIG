import type { Metadata } from "next";
import { Rethink_Sans, Roboto } from "next/font/google";
import "./globals.css";

// Display / headings + buttons (Green Street uses Rethink Sans)
const rethinkSans = Rethink_Sans({
  variable: "--font-rethink",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

// Body copy (Green Street uses Roboto)
const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ai4astro.org"),
  title: {
    default: "NASA Cosmic Origins AI/ML STIG",
    template: "%s | NASA AI/ML STIG",
  },
  description:
    "The NASA Cosmic Origins Program AI/ML Science and Technology Interest Group: an open lecture series and growing library of domain-specific AI education — from deep learning foundations to agentic AI — for astronomical research.",
  keywords: [
    "NASA",
    "AI",
    "Machine Learning",
    "Astronomy",
    "Cosmic Origins",
    "COPAG",
    "Deep Learning",
    "Transformers",
    "LLM",
    "Agentic AI",
    "AI Agents",
  ],
  authors: [{ name: "Yuan-Sen Ting" }],
  creator: "NASA Cosmic Origins AI/ML STIG",
  openGraph: {
    title: "NASA Cosmic Origins AI/ML STIG",
    description:
      "Building AI literacy for astronomical research — from deep learning foundations to agentic AI, instrumentation, policy, and AI for NASA missions and surveys.",
    url: "https://ai4astro.org",
    siteName: "NASA Cosmic Origins AI/ML STIG",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${rethinkSans.variable} ${roboto.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
