'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, RefreshCw, Bell, CheckCircle2, Menu } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { WalletConnectButton } from '@/components/shared/wallet-connect-button';
import { TourTriggerButton, type TourPage } from '@/components/tour';
import { cn } from '@/lib/utils';

type ChainStatus = 'synced' | 'indexing' | 'degraded';

function ChainStatusPill({ status }: { status: ChainStatus }) {
  const config = {
    synced:   { label: 'Synced',   color: 'text-[#4ADE80]', bg: 'bg-[#4ADE80]/10', border: 'border-[#4ADE80]/30', dot: 'bg-[#4ADE80]' },
    indexing: { label: 'Indexing', color: 'text-[#FCD34D]', bg: 'bg-[#FCD34D]/10', border: 'border-[#FCD34D]/30', dot: 'bg-[#FCD34D]' },
    degraded: { label: 'Degraded', color: 'text-[#FB7185]', bg: 'bg-[#FB7185]/10', border: 'border-[#FB7185]/30', dot: 'bg-[#FB7185]' },
  }[status];

  return (
    <div className={cn(
      'inline-flex items-center gap-2 rounded-none border-l-2 px-3 py-1',
      config.bg, config.border,
    )}>
      <div className={cn('h-1.5 w-1.5 rounded-none animate-pulse', config.dot)} />
      <span className={cn('text-[10px] font-black uppercase tracking-[0.2em]', config.color)}>
        SYS::{config.label}
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
  const queryClient = useQueryClient();

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
      await queryClient.invalidateQueries();
      router.refresh();
    } finally {
      setTimeout(() => setIsSyncing(false), 1500);
    }
  }, [router, queryClient]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/scanner?search=${encodeURIComponent(search.trim())}`);
  }, [search, router]);

  return (
    <header className={cn(
      'flex h-16 flex-shrink-0 items-center gap-4 px-6',
      'border-b border-[#4ADE80]/20',
      'bg-[#05070A]/80 backdrop-blur-xl',
      'relative z-50',
    )}>
      {/* Top Industrial Line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#4ADE80]/40 to-transparent" />

      {/* Left Area */}
      <div className="flex flex-1 items-center gap-5">
        <button
          onClick={onMenuToggle}
          className="flex h-10 w-10 items-center justify-center rounded-none border border-[#4ADE80]/10 text-[#4ADE80]/40 hover:bg-[#4ADE80]/10 hover:text-[#4ADE80] lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        {pathname === '/' && (
          <Link href="/" className="flex items-center group">
            <div className="relative">
              <Image
                src="/logo-f1-waves-dark.svg"
                alt="Enigma"
                width={30}
                height={30}
                className="object-contain transition-all group-hover:scale-110"
              />
              <div className="absolute -inset-2 bg-[#4ADE80]/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        )}
        <ChainStatusPill status={chainStatus} />
      </div>

      {/* Center Area — Search with Industrial Glow */}
      <form
        onSubmit={handleSearch}
        className="hidden w-full max-w-md md:block"
      >
        <div className="group relative w-full">
          <Search className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-all duration-300 z-10",
            search ? "text-[#4ADE80] scale-110" : "text-[#4ADE80]/30"
          )} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ACCESS_DATABASE_v1.0..."
            className={cn(
              'h-11 w-full rounded-none pl-12 pr-20 text-[11px] font-mono font-black uppercase tracking-[0.15em]',
              'bg-[#080B10] border border-[#4ADE80]/20',
              'text-[#4ADE80] placeholder:text-[#4ADE80]/20',
              'focus:outline-none focus:border-[#4ADE80]/50 focus:bg-[#4ADE80]/[0.05]',
              'transition-all duration-300 shadow-[inset_0_0_20px_rgba(0,0,0,0.4)]',
              'focus:shadow-[0_0_25px_rgba(74,222,128,0.15)] focus:ring-1 focus:ring-[#4ADE80]/20',
            )}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <kbd className={cn(
              'rounded-none border border-[#4ADE80]/20 px-2 py-0.5',
              'text-[9px] font-black text-[#4ADE80]/40',
              'bg-[#4ADE80]/5 flex items-center justify-center',
            )}>
              CTR K
            </kbd>
          </div>
        </div>
      </form>

      {/* Right Area — Professional Actions */}
      <div className="flex flex-1 items-center justify-end gap-3">
        {/* Help */}
        {currentTourPage && <TourTriggerButton page={currentTourPage} />}

        {/* Sync Action */}
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-none transition-all duration-300',
            'border border-[#4ADE80]/20 bg-[#4ADE80]/5 text-[#4ADE80]/60',
            'hover:border-[#4ADE80]/60 hover:bg-[#4ADE80]/15 hover:text-[#4ADE80]',
            'hover:shadow-[0_0_15px_rgba(74,222,128,0.2)]',
            'disabled:opacity-20 active:scale-95',
          )}
        >
          <RefreshCw className={cn('h-4 w-4', isSyncing && 'animate-spin')} />
        </button>

        {/* Notifs */}
        <button className={cn(
          'relative flex h-10 w-10 items-center justify-center rounded-none transition-all duration-300',
          'border border-[#4ADE80]/20 bg-[#4ADE80]/5 text-[#4ADE80]/60',
          'hover:border-[#4ADE80]/60 hover:bg-[#4ADE80]/15 hover:text-[#4ADE80]',
        )}>
          <Bell className="h-4 w-4" />
          <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-none bg-[#4ADE80] shadow-[0_0_8px_#4ADE80] animate-pulse" />
        </button>

        {/* Call to Register */}
        <Link
          href="/register"
          className={cn(
            'hidden items-center gap-3 rounded-none px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] md:flex',
            'bg-[#4ADE80]/10 border border-[#4ADE80]/40 text-[#4ADE80]',
            'hover:bg-[#4ADE80]/20 hover:border-[#4ADE80] transition-all duration-300',
            'shadow-[0_0_20px_rgba(74,222,128,0.1)] hover:shadow-[0_0_30px_rgba(74,222,128,0.3)]',
          )}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          INIT_REGISTRY
        </Link>

        {/* Wallet Connection */}
        <WalletConnectButton className="h-10 border-[#4ADE80]/40 hover:border-[#4ADE80]" />
      </div>
    </header>
  );
}
