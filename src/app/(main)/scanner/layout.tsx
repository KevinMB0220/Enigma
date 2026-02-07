import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agent Scanner',
  description: 'Browse and discover autonomous agents on Avalanche. Filter by type, status, and trust score.',
  openGraph: {
    title: 'Agent Scanner | Enigma',
    description: 'Browse and discover autonomous agents on Avalanche',
  },
};

export default function ScannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
