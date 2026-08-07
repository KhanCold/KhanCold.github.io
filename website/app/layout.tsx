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

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");
const title = "Qiming Shi · 史启明";
const description =
  "Personal academic homepage of Qiming Shi, a master's student at Zhejiang University working on NLP, HCI, and agentic reinforcement learning.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: { canonical: siteUrl },
  icons: {
    icon: [
      { url: `${siteUrl}/favicon-32.png`, sizes: "32x32", type: "image/png" },
      { url: `${siteUrl}/icon.png`, sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: `${siteUrl}/apple-touch-icon.png`, sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title,
    description,
    type: "website",
    url: siteUrl,
    images: [{ url: `${siteUrl}/og.png`, width: 1659, height: 948 }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [`${siteUrl}/og.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
