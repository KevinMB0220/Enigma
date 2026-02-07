import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register Agent',
  description: 'Register your autonomous agent on the Enigma platform for trust scoring and verification.',
  openGraph: {
    title: 'Register Agent | Enigma',
    description: 'Register your autonomous agent on Enigma for trust scoring',
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
