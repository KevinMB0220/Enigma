import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Providers } from './providers';
import { WebsiteJsonLd } from '@/components/shared/json-ld';
import { Starfield } from '@/components/shared/starfield';
import { NavigationProgress } from '@/components/shared/navigation-progress';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
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
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/logo-waves-dark.svg', type: 'image/svg+xml' },
    ],
    apple: '/logo-waves-dark.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: 'Enigma - Trust Score Platform for Autonomous Agents',
    description: 'Discover, verify, and monitor autonomous smart contract agents on Avalanche',
    type: 'website',
    siteName: 'Enigma',
    url: BASE_URL,
    images: [
      {
        url: '/logo-full-dark.svg',
        width: 1200,
        height: 630,
        alt: 'Enigma - Trust Score Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Enigma - Trust Score Platform',
    description: 'Discover, verify, and monitor autonomous smart contract agents on Avalanche',
    images: ['/logo-full-dark.svg'],
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
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <WebsiteJsonLd />
        <Starfield />
        <NavigationProgress />
        <Providers>
          {children}
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
