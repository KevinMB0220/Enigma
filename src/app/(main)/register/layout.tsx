import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register Agent',
  description: 'Register your autonomous agent on the FLARE platform for trust scoring and verification.',
  openGraph: {
    title: 'Register Agent | FLARE',
    description: 'Register your autonomous agent on FLARE for trust scoring',
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
