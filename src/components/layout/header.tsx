'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu as MenuIcon, X as XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WalletConnectButton } from '@/components/shared/wallet-connect-button';
import { SearchBar } from '@/components/scanner/search-bar';

const navLinks = [
  { href: '/', label: 'Home', exact: true },
  { href: '/scanner', label: 'Scanner', exact: true },
  { href: '/scanner/agents', label: 'Agents', exact: false },
  { href: '/docs', label: 'Docs', exact: false },
  { href: '/register', label: 'Register', exact: true },
] as const;

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => { setOpen(false); }, [pathname]);

  const isScannerPage = pathname.startsWith('/scanner');

  return (
    <>
      <header
        className={cn(
          'fixed left-0 right-0 top-0 z-[110] h-[72px] transition-all bg-flare-bg/80 backdrop-blur-xl',
          'border-none' // NO WHITE BORDERS OR BOTTOM LINES
        )}
      >
        <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-8">

          {/* Branding Section - ENFORCED SYNC WITH SIDEBAR LOGO */}
          <div className="flex items-center gap-10 flex-[1.5]">
            <Link href="/" className="group flex items-center gap-3 shrink-0">
              <div className="flex h-10 w-10 items-center justify-center bg-transparent rounded-none group-hover:scale-105 transition-all">
                <Image 
                   src="/logo-f1-waves-dark.svg" 
                   alt="Enigma" 
                   width={36} 
                   height={36} 
                   className="object-contain" 
                   priority
                />
              </div>
              <span className="font-black text-flare-text-h tracking-[0.4em] text-xl uppercase group-hover:text-flare-accent transition-colors">Enigma</span>
            </Link>

            {/* SearchBar on Scanner */}
            {isScannerPage && (
              <div className="hidden lg:block w-full max-w-[400px]">
                <SearchBar
                  value={search}
                  onChange={setSearch}
                  className="bg-flare-surface/40 border-flare-stroke/20"
                />
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className={cn(
            "hidden items-center justify-center gap-8 md:flex h-full",
            isScannerPage ? "flex-1" : "flex-[2]"
          )}>
            {navLinks.map((link) => {
              const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  className={cn(
                    'relative flex h-full items-center text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-300 group/nav',
                    active ? 'text-flare-accent' : 'text-flare-text-l hover:text-flare-text-h'
                  )}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-[20px] left-1/2 h-[2px] w-[20px] -translate-x-1/2 bg-flare-accent shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Section */}
          <div className="flex items-center justify-end gap-6 flex-[1.2]">
            <div className="hidden xl:block">
              {/* Wallet button with solid green accent and no white borders */}
              <WalletConnectButton className="h-10 px-8 text-[11px] font-black border border-[#4ADE80] text-[#4ADE80] bg-transparent hover:bg-flare-accent/10 transition-all rounded-none tracking-[0.2em] uppercase" />
            </div>

            <Link
              href="/scanner"
              className={cn(
                'group hidden items-center justify-center h-10 px-8 text-[11px] font-black uppercase tracking-[0.25em] md:flex rounded-none',
                'bg-flare-accent text-flare-bg hover:translate-y-[-1px] transition-all shadow-[0_4px_20px_rgba(74,222,128,0.2)]'
              )}
            >
              Scanner_01
            </Link>

            <button
              onClick={() => setOpen(p => !p)}
              className="flex h-10 w-10 items-center justify-center rounded-none text-flare-text-l hover:text-flare-accent md:hidden transition-colors"
            >
              {open ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={cn(
          'md:hidden overflow-hidden transition-all duration-300 border-b border-flare-stroke',
          'bg-flare-bg/98 backdrop-blur-2xl',
          open ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0',
        )}>
          <nav className="flex flex-col px-8 py-10 gap-6">
            {navLinks.map((link) => {
              const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  className={cn(
                    'text-[15px] font-black uppercase tracking-[0.25em] py-3 transition-all',
                    active ? 'text-flare-accent border-l-4 border-flare-accent pl-4' : 'text-flare-text-l hover:text-flare-text-h'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
    </>
  );
}

export default Header;
