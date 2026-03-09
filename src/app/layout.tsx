import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "0Fill - Turn Forms Into AI Conversations | No-Code Form Builder",
  description: "Transform static Google Forms into intelligent AI-driven chat experiences that collect structured data automatically. No coding required. Trusted by 2,000+ companies.",
  keywords: [
    "AI forms",
    "conversational forms",
    "form builder",
    "Google Forms alternative",
    "AI chatbot forms",
    "data collection",
    "no-code forms",
    "intelligent forms",
    "form automation",
    "customer surveys"
  ],
  authors: [{ name: "0Fill Team" }],
  creator: "0Fill",
  publisher: "0Fill Inc.",
  metadataBase: new URL('https://0fill.ai'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://0fill.ai',
    title: '0Fill - Turn Forms Into AI Conversations',
    description: 'Transform static Google Forms into intelligent AI-driven chat experiences. No coding required. Trusted by 2,000+ companies.',
    siteName: '0Fill',
  },
  twitter: {
    card: 'summary_large_image',
    title: '0Fill - Turn Forms Into AI Conversations',
    description: 'Transform static Google Forms into intelligent AI-driven chat experiences. No coding required.',
    creator: '@0Fill',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} scroll-smooth`}>
      <body className={`${inter.className} antialiased`}>
        <div className="relative min-h-screen bg-[#0B0B0F] text-white selection:bg-[#10B981] selection:text-white overflow-x-hidden">
          {children}
          <Toaster />
        </div>
      </body>
    </html>
  );
}
