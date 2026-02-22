import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Ardian | Portfolio",
    template: "%s | Ardian Portfolio",
  },
  description:
    "Portfolio of Ardian - A passionate developer crafting beautiful, functional, and user-centered digital experiences. Explore my projects, skills, and journey.",
  keywords: [
    "portfolio",
    "developer",
    "web developer",
    "software engineer",
    "frontend",
    "backend",
    "full-stack",
    "projects",
    "web development",
    "Ardian",
  ],
  authors: [{ name: "Ardian" }],
  creator: "Ardian",
  publisher: "Ardian",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Ardian | Portfolio",
    title: "Ardian | Portfolio",
    description:
      "Portfolio of Ardian - A passionate developer crafting beautiful, functional, and user-centered digital experiences.",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Ardian Portfolio",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ardian | Portfolio",
    description:
      "Portfolio of Ardian - A passionate developer crafting beautiful, functional, and user-centered digital experiences.",
    images: [`${baseUrl}/og.png`],
    creator: "@ardian",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // yahoo: "your-yahoo-verification-code",
  },
  alternates: {
    canonical: baseUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
