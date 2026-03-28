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
    { href: '/scanner',        label: 'Scanner'        },
    { href: '/scanner/agents', label: 'Agent Registry' },
    { href: '/register',       label: 'Register Agent' },
  ],
  resources: [
    { href: '/docs',           label: 'Documentation'  },
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
        'w-full py-16 px-6 border-t border-flare-stroke bg-flare-bg',
        className
      )}
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Branding Section */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/logo-f1-waves-dark.svg"
                alt="FLARE"
                width={28}
                height={28}
                className="object-contain transition-transform group-hover:scale-105"
              />
              <span className="text-sm font-bold text-flare-text-h tracking-tight uppercase">FLARE Platform</span>
            </Link>
            <p className="text-xs text-flare-text-l leading-relaxed uppercase tracking-wider">
              Autonomous Agent <br /> Reputation Layer <br /> Built on Avalanche
            </p>
          </div>

          {/* Product Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-flare-text-h">Registry</h3>
            <nav className="flex flex-col gap-2">
              {footerLinks.product.map((link) => (
                <Link
                  key={link.href}
                  href={link.href as '/'}
                  className="text-sm text-flare-text-l transition-colors duration-200 hover:text-flare-accent"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Resources Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-flare-text-h">Resources</h3>
            <nav className="flex flex-col gap-2">
              {footerLinks.resources.map((link) => (
                <Link
                  key={link.href}
                  href={link.href as '/'}
                  className="text-sm text-flare-text-l transition-colors duration-200 hover:text-flare-accent"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-flare-text-h">Network</h3>
            <nav className="flex gap-2">
              {footerLinks.social.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href as '/'}
                    className="h-8 w-8 rounded-sm bg-flare-surface border border-flare-stroke flex items-center justify-center text-flare-text-l transition-all duration-200 hover:text-flare-accent hover:border-flare-accent/30"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon size={16} />
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-flare-stroke flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-mono text-flare-text-l uppercase tracking-widest leading-relaxed">
            © {currentYear} FLARE. REPUTATION LAYER FOR THE AGENTIC AGE.
          </p>
          
          <div className="flex items-center gap-4 py-2 px-4 bg-flare-surface/30 border border-white/5 self-end">
            <span className="text-[9px] font-mono text-flare-text-l uppercase tracking-[0.2em]">Validated by</span>
            <div className="flex items-center gap-2">
              <img 
                src="/avalanche-logo.webp" 
                alt="Avalanche" 
                className="w-4 h-4 object-contain"
              />
              <span className="text-[10px] font-black uppercase tracking-[0.1em] text-white">Avalanche</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
