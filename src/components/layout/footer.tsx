import { type FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Twitter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
}

const footerLinks = {
  product: [
    { href: '/scanner', label: 'Scanner' },
    { href: '/docs/api', label: 'API Docs' },
  ],
  resources: [
    { href: '/docs', label: 'Documentation' },
  ],
  social: [
    {
      href: 'https://x.com/snowrail_latam?s=20',
      label: 'Twitter',
      icon: Twitter,
      external: true,
    },
  ],
};

export const Footer: FC<FooterProps> = ({ className }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={cn(
        // Layout
        'w-full py-12 px-4',
        // Glassmorphism
        'bg-[rgba(15,17,23,0.6)] backdrop-blur-[20px]',
        'border-t border-[rgba(255,255,255,0.06)]',
        className
      )}
    >
      <div className="mx-auto max-w-7xl">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">
          {/* Branding Section */}
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="flex items-center gap-2.5 transition-opacity duration-200 hover:opacity-80"
            >
              <Image src="/enigma.png" alt="Enigma" width={28} height={28} className="rounded-lg object-contain" />
              <span className="text-xl font-bold text-white">Enigma</span>
            </Link>
            <p className="text-sm text-[#9CA3AF]">
              AI Agent Transparency for Avalanche
            </p>
            {/* Built for Avalanche Badge */}
            <div className="flex items-center gap-2">
              <div className="rounded-[8px] bg-[rgba(232,65,66,0.15)] border border-[rgba(232,65,66,0.3)] px-3 py-1.5">
                <span className="text-xs font-semibold text-[#E84142]">
                  Built for Avalanche
                </span>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-white">Product</h3>
            <nav className="flex flex-col gap-2">
              {footerLinks.product.map((link) => (
                <Link
                  key={link.href}
                  href={link.href as '/'}
                  className="text-sm text-[#9CA3AF] transition-colors duration-200 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Resources Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-white">Resources</h3>
            <nav className="flex flex-col gap-2">
              {footerLinks.resources.map((link) => (
                <Link
                  key={link.href}
                  href={link.href as '/'}
                  className="text-sm text-[#9CA3AF] transition-colors duration-200 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-white">Social</h3>
            <nav className="flex gap-3">
              {footerLinks.social.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href as '/'}
                    className="rounded-[8px] p-2 text-[#9CA3AF] transition-all duration-200 hover:bg-[rgba(255,255,255,0.06)] hover:text-white"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                  >
                    <Icon size={20} />
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Section - Copyright */}
        <div className="mt-12 border-t border-[rgba(255,255,255,0.06)] pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-[#6B7280]">
              © {currentYear} Enigma. All rights reserved.
            </p>
            <p className="text-sm text-[#6B7280]">
              Made with ❤️ for the Avalanche ecosystem
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
