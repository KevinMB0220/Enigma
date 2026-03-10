'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, RefreshCw, Bell, CheckCircle2, Menu } from 'lucide-react';
import Image from 'next/image';
import { WalletConnectButton } from '@/components/shared/wallet-connect-button';
import { TourTriggerButton, type TourPage } from '@/components/tour';
import { cn } from '@/lib/utils';

type ChainStatus = 'synced' | 'indexing' | 'degraded';

function ChainStatusPill({ status }: { status: ChainStatus }) {
  const config = {
    synced:   { label: 'Synced',   color: 'text-primary',    bg: 'bg-[rgba(74,222,128,0.08)]',  border: 'border-[rgba(74,222,128,0.2)]',  dot: 'bg-primary' },
    indexing: { label: 'Indexing', color: 'text-[#FCD34D]',  bg: 'bg-[rgba(252,211,77,0.08)]',   border: 'border-[rgba(252,211,77,0.2)]',   dot: 'bg-[#FCD34D]' },
    degraded: { label: 'Degraded', color: 'text-[#FB7185]',  bg: 'bg-[rgba(251,113,133,0.08)]', border: 'border-[rgba(251,113,133,0.2)]', dot: 'bg-[#FB7185]' },
  }[status];

  return (
    <div className={cn(
      'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1',
      config.bg, config.border,
    )}>
      <div className={cn('h-1.5 w-1.5 rounded-full animate-pulse', config.dot)} />
      <span className={cn('text-[11px] font-medium', config.color)}>
        Chain: {config.label}
      </span>
    </div>
  );
}

interface DashboardNavbarProps {
  onMenuToggle?: () => void;
}

export function DashboardNavbar({ onMenuToggle }: DashboardNavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [chainStatus] = useState<ChainStatus>('synced');

  // Determine current tour page
  const currentTourPage: TourPage | null = pathname.includes('/agents/')
    ? 'agent'
    : pathname.includes('/scanner')
      ? 'scanner'
      : pathname.includes('/register')
        ? 'register'
        : pathname.includes('/docs')
          ? 'docs'
          : null;

  const handleSync = useCallback(async () => {
    setIsSyncing(true);
    try {
      await fetch('/api/v1/indexer/refresh', { method: 'POST' });
    } finally {
      setTimeout(() => setIsSyncing(false), 1500);
    }
  }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/scanner?search=${encodeURIComponent(search.trim())}`);
    }
  }, [search, router]);

  return (
    <header className={cn(
      'flex h-14 flex-shrink-0 items-center gap-4 px-5',
      'border-b border-[rgba(255,255,255,0.06)]',
      'bg-[rgba(11,15,20,0.9)] backdrop-blur-[24px]',
      'relative z-50',
    )}>

      {/* Left — Hamburger (mobile) + Logo + Chain Status */}
      <div className="flex flex-1 items-center gap-3">
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuToggle}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#94A3B8] hover:bg-[rgba(255,255,255,0.06)] hover:text-white lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-4 w-4" />
        </button>
        <Link href="/" className="flex items-center group">
          <Image
            src="/logo-f1-waves-dark.svg"
            alt="Enigma"
            width={32}
            height={32}
            className="object-contain transition-transform group-hover:scale-105"
          />
        </Link>
        <div className="hidden h-4 w-px bg-[rgba(255,255,255,0.08)] sm:block" />
        <ChainStatusPill status={chainStatus} />
      </div>

      {/* Center — Global Search */}
      <form
        onSubmit={handleSearch}
        className="hidden w-full max-w-sm md:block px-4"
      >
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#475569]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search agents, wallets, hashes..."
            className={cn(
              'h-9 w-full rounded-lg pl-9 pr-14 text-sm',
              'bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)]',
              'text-[#E5E7EB] placeholder:text-[#475569]',
              'focus:outline-none focus:border-[rgba(74,222,128,0.3)] focus:bg-[rgba(255,255,255,0.06)]',
              'transition-all duration-150',
            )}
          />
          <kbd className={cn(
            'absolute right-2.5 top-1/2 -translate-y-1/2',
            'rounded border border-[rgba(255,255,255,0.08)] px-1.5 py-0.5',
            'text-[10px] font-mono text-[#475569]',
            'bg-[rgba(255,255,255,0.04)]',
          )}>
            ⌘K
          </kbd>
        </div>
      </form>

      {/* Right — Actions */}
      <div className="flex flex-1 items-center justify-end gap-2">

        {/* Tour Help */}
        {currentTourPage && <TourTriggerButton page={currentTourPage} />}

        {/* Sync */}
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-150',
            'border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)]',
            'text-[#94A3B8] hover:border-[rgba(74,222,128,0.3)] hover:bg-[rgba(74,222,128,0.06)] hover:text-primary',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
          title="Sync indexer"
        >
          <RefreshCw className={cn('h-3.5 w-3.5', isSyncing && 'animate-spin')} />
        </button>

        {/* Notifications */}
        <button className={cn(
          'relative flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-150',
          'border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)]',
          'text-[#94A3B8] hover:bg-[rgba(255,255,255,0.06)] hover:text-white',
        )}>
          <Bell className="h-3.5 w-3.5" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>

        {/* Register */}
        <Link
          href="/register"
          className={cn(
            'hidden items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold sm:flex',
            'bg-[rgba(74,222,128,0.1)] border border-[rgba(74,222,128,0.25)] text-primary',
            'hover:bg-[rgba(74,222,128,0.18)] hover:border-[rgba(74,222,128,0.4)] transition-all duration-150',
          )}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          Register Agent
        </Link>

        {/* Wallet */}
        <WalletConnectButton className="h-8 text-xs" />
      </div>
    </header>
  );
}
