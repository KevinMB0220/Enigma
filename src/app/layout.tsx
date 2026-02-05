import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Header, Footer } from '@/components/layout';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Enigma - Trust Score Platform for Autonomous Agents',
  description:
    'Discovery, Verification, and Trust Scoring Platform for Autonomous Agents on Avalanche',
  keywords: ['blockchain', 'avalanche', 'autonomous agents', 'trust score', 'web3', 'defi'],
  authors: [{ name: 'Enigma Team' }],
  openGraph: {
    title: 'Enigma',
    description: 'Trust Score Platform for Autonomous Agents on Avalanche',
    type: 'website',
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
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
