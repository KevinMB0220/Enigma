import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Providers } from './providers';
import { WebsiteJsonLd } from '@/components/shared/json-ld';
import { Starfield } from '@/components/shared/starfield';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://enigma.app';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Enigma - Trust Score Platform for Autonomous Agents',
    template: '%s | Enigma',
  },
  description:
    'Discovery, Verification, and Trust Scoring Platform for Autonomous Agents on Avalanche',
  keywords: ['blockchain', 'avalanche', 'autonomous agents', 'trust score', 'web3', 'defi', 'smart contracts', 'erc-804'],
  authors: [{ name: 'Enigma Team' }],
  openGraph: {
    title: 'Enigma - Trust Score Platform for Autonomous Agents',
    description: 'Discover, verify, and monitor autonomous smart contract agents on Avalanche',
    type: 'website',
    siteName: 'Enigma',
    url: BASE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Enigma - Trust Score Platform',
    description: 'Discover, verify, and monitor autonomous smart contract agents on Avalanche',
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
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <WebsiteJsonLd />
        <Starfield />
        <Providers>
          {children}
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
