'use client';

import Link from 'next/link';
import type { Route } from 'next';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  Bot,
  PlusCircle,
  BarChart2,
  Settings,
  Home,
  Shield,
  Activity,
  ChevronRight,
  GitBranch,
  BookOpen,
  X,
} from 'lucide-react';
import { useAgentStats } from '@/hooks/use-agent-stats';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/',               label: 'Home',     icon: Home,            exact: true  },
  { href: '/scanner',        label: 'Overview', icon: LayoutDashboard, exact: true  },
  { href: '/scanner/agents', label: 'Agents',   icon: Bot,             exact: false },
  { href: '/register',       label: 'Register', icon: PlusCircle,      exact: true  },
  { href: '/docs',           label: 'Docs',     icon: BookOpen,        exact: false },
];

const disabledItems = [
  { label: 'Analytics', icon: BarChart2 },
  { label: 'Settings',  icon: Settings  },
];

interface DashboardSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function DashboardSidebar({ isOpen = false, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { data: stats } = useAgentStats();
  const [isHovered, setIsHovered] = useState(false);

  const verifiedPct = stats && stats.total > 0
    ? Math.round((stats.verified / stats.total) * 100)
    : 0;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[110] bg-black/90 lg:hidden backdrop-blur-md"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          'flex h-screen flex-shrink-0 flex-col transition-all duration-300 ease-in-out',
          'border-r border-flare-stroke bg-flare-surface/90 backdrop-blur-3xl',
          'fixed inset-y-0 left-0 z-[120]', // Ensures it sits perfectly over the content
          // Desktop: Collapsible Widths
          'lg:w-20 lg:hover:w-64',
          // Mobile state
          isOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0',
          // Hover State Shadows
          isHovered && "lg:shadow-[50px_0_100px_rgba(0,0,0,0.9)]"
        )}
      >
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-none text-flare-accent lg:hidden border border-flare-accent bg-flare-accent/5"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Brand / Logo - FLUSH with Header (No border-b to match borderless header) */}
        <div className="flex h-[64px] items-center px-6 overflow-hidden shrink-0">
          <div className="flex items-center gap-5 min-w-[200px]">
             <div className="flex-shrink-0">
                <Image src="/logo-f1-waves-dark.svg" alt="FLARE" width={32} height={32} className="object-contain" />
             </div>
             <span className={cn(
               "font-black text-flare-text-h text-lg uppercase tracking-[0.4em] transition-opacity duration-300",
               isHovered || isOpen ? "opacity-100" : "opacity-0"
             )}>
               FLARE
             </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-10 px-4 space-y-3 scrollbar-hide overflow-x-hidden">
          {navItems.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href as Route}
                onClick={onClose}
                className={cn(
                  'group flex items-center h-14 rounded-none transition-all duration-300 relative overflow-hidden',
                  active
                    ? 'text-flare-accent bg-flare-accent/[0.03]'
                    : 'text-flare-text-l hover:text-flare-text-h hover:bg-flare-bg/40'
                )}
              >
                {/* Homepage Hover Style (Vertical Line) */}
                <div className={cn(
                  "absolute left-0 top-0 bottom-0 w-[3px] bg-flare-accent transition-all duration-300 origin-top",
                  active ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100"
                )} />

                <div className="flex items-center gap-5 min-w-[200px] px-4">
                  <div className="flex-shrink-0 w-6 flex justify-center">
                    <Icon className={cn('h-5 w-5 transition-transform duration-300', active && 'text-flare-accent shadow-[0_0_15px_rgba(74,222,128,0.4)]')} />
                  </div>
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-[0.3em] transition-opacity duration-300",
                    isHovered || isOpen ? "opacity-100" : "opacity-0"
                  )}>
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}

          <div className="my-8 border-t border-flare-stroke mx-4 opacity-40" />

          {disabledItems.map((item) => (
            <div
              key={item.label}
              className="group flex items-center h-14 rounded-none opacity-10 grayscale cursor-not-allowed"
            >
              <div className="flex items-center gap-5 min-w-[200px] px-4">
                <div className="flex-shrink-0 w-6 flex justify-center">
                  <item.icon className="h-5 w-5" />
                </div>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-[0.3em] transition-opacity duration-300 whitespace-nowrap",
                  isHovered || isOpen ? "opacity-100" : "opacity-0"
                )}>
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </nav>

        {/* Global Telemetry */}
        <div className={cn(
          "mt-auto p-10 border-t border-flare-stroke bg-[#05070A]/80 transition-all duration-700",
          isHovered || isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20 pointer-events-none lg:h-0 lg:p-0"
        )}>
          <div className="flex items-center gap-4 mb-8">
             <div className="w-2 h-2 bg-flare-accent animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
             <p className="text-[9px] font-black uppercase tracking-[0.4em] text-flare-accent/90">Core Telemetry</p>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between group/sync">
              <span className="text-[10px] font-black uppercase tracking-widest text-flare-text-l transition-colors group-hover/sync:text-flare-text-h">Sequence_Index</span>
              <span className="font-mono text-xs font-black text-flare-text-h">{stats?.total ?? '—'}</span>
            </div>
            <div className="flex items-center justify-between group/trust">
              <span className="text-[10px] font-black uppercase tracking-widest text-flare-text-l transition-colors group-hover/trust:text-flare-text-h">Trust_Quotient</span>
              <span className="font-mono text-xs font-black text-flare-accent">{verifiedPct}%</span>
            </div>
            <div className="w-full h-[2px] bg-flare-stroke">
              <div className="h-full bg-flare-accent shadow-[0_0_15px_rgba(74,222,128,0.6)] transition-all duration-1000" style={{ width: `${verifiedPct}%` }} />
            </div>
          </div>
        </div>

        {/* Footer hidden markers */}
        {!isHovered && !isOpen && (
          <div className="mt-auto items-center flex flex-col gap-10 py-10 border-t border-flare-stroke hidden lg:flex">
            <Activity className="w-4 h-4 text-flare-accent opacity-10 animate-pulse" />
            <Shield className="w-4 h-4 text-flare-accent opacity-10" />
          </div>
        )}
      </aside>
    </>
  );
}
