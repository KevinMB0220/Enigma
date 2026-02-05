'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WalletConnectButton } from '@/components/shared/wallet-connect-button';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/scanner', label: 'Scanner' },
];

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isMobileMenuOpen]);

  const handleBackdropClick = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  return (
    <>
      <header
        className={cn(
          // Position & Layout
          'fixed top-4 left-4 right-4 z-50 mx-auto max-w-7xl',
          // Glassmorphism base (docs: .header-glass)
          'bg-[rgba(15,17,23,0.6)] backdrop-blur-[20px]',
          'border border-[rgba(255,255,255,0.06)] rounded-[16px]',
          'shadow-[0_4px_24px_rgba(0,0,0,0.4)]',
          // Transition
          'transition-all duration-300',
          // Scroll state: enhanced glassmorphism
          isScrolled && 'bg-[rgba(15,17,23,0.8)] border-[rgba(59,130,246,0.3)]'
        )}
      >
        {/* Inner container with exact padding from docs: 16px 32px, mobile: 12px 16px */}
        <div className="flex items-center justify-between px-4 py-3 md:px-8 md:py-4">
          {/* Logo - 20px font-weight-700 per typography docs */}
          <Link
            href="/"
            className="text-xl font-bold text-white transition-opacity duration-200 hover:opacity-80"
          >
            Enigma
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href as '/'}
                className={cn(
                  // Base styles - 14px body text, 500 weight, 200ms transition
                  'px-4 py-2 rounded-[8px] text-sm font-medium',
                  'transition-all duration-200',
                  // Active state with primary border
                  pathname === link.href
                    ? 'text-white bg-[rgba(59,130,246,0.15)] border border-[rgba(59,130,246,0.3)]'
                    : 'text-[#9CA3AF] hover:text-white hover:bg-[rgba(255,255,255,0.06)]'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <WalletConnectButton />

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={toggleMobileMenu}
              className={cn(
                'md:hidden p-2 rounded-[8px]',
                'text-[#9CA3AF] hover:text-white hover:bg-[rgba(255,255,255,0.06)]',
                'transition-all duration-200'
              )}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - slide down animation */}
        <div
          className={cn(
            'md:hidden overflow-hidden',
            'transition-all duration-300 ease-in-out',
            isMobileMenuOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <nav className="flex flex-col gap-1 px-4 pb-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href as '/'}
                className={cn(
                  'px-4 py-3 rounded-[8px] text-sm font-medium',
                  'transition-all duration-200',
                  pathname === link.href
                    ? 'text-white bg-[rgba(59,130,246,0.15)] border border-[rgba(59,130,246,0.3)]'
                    : 'text-[#9CA3AF] hover:text-white hover:bg-[rgba(255,255,255,0.06)]'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={handleBackdropClick}
          aria-hidden="true"
        />
      )}

      {/* Spacer for fixed header */}
      <div className="h-24" />
    </>
  );
}

export default Header;
