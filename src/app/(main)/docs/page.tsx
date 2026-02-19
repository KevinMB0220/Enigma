import type { Metadata } from 'next';
import Link from 'next/link';
import {
  BookOpen,
  FileCode2,
  Shield,
  BarChart3,
  Cpu,
  ArrowRight,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Documentation — Enigma',
  description: 'Learn how Enigma works: trust scores, ERC-8004 agent registry, API reference, and more.',
};

interface DocCard {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
  badge?: string;
  external?: boolean;
  accentColor: string;
}

const docCards: DocCard[] = [
  {
    icon: BookOpen,
    title: 'Getting Started',
    description: 'What is Enigma, how to explore the scanner, and how to read an agent\'s trust certificate.',
    href: '#getting-started',
    accentColor: '#4ADE80',
    badge: 'Coming Soon',
  },
  {
    icon: Layers,
    title: 'ERC-8004 Registry',
    description: 'How agent identity works on Avalanche C-Chain. How tokenURI resolves to services, capabilities, and registrations.',
    href: '#erc-8004',
    accentColor: '#22D3EE',
    badge: 'Coming Soon',
  },
  {
    icon: Shield,
    title: 'Trust Score System',
    description: 'Weighted scoring model: verification (30%), community ratings (25%), on-chain activity (20%), reporting history (15%), time factor (10%).',
    href: '#trust-score',
    accentColor: '#4ADE80',
    badge: 'Coming Soon',
  },
  {
    icon: FileCode2,
    title: 'API Reference',
    description: 'Full REST API documentation. Endpoints for listing agents, trust scores, ratings, reports, and platform statistics.',
    href: '/docs/api',
    accentColor: '#22D3EE',
  },
  {
    icon: Cpu,
    title: 'Agent Metadata',
    description: 'How tokenURI resolves to agent services, capabilities, on-chain registrations, and supportedTrust fields.',
    href: '#agent-metadata',
    accentColor: '#FCD34D',
    badge: 'Coming Soon',
  },
  {
    icon: BarChart3,
    title: 'Analytics & Indexer',
    description: 'How the Enigma indexer syncs on-chain Transfer events, recalculates trust scores every 3 hours, and surfaces platform analytics.',
    href: '#analytics',
    accentColor: '#A78BFA',
    badge: 'Coming Soon',
  },
];

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">

      {/* Header */}
      <div className="mb-10">
        <div className={cn(
          'mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1',
          'border-[rgba(74,222,128,0.2)] bg-[rgba(74,222,128,0.06)]',
        )}>
          <BookOpen className="h-3 w-3 text-primary" />
          <span className="text-[11px] font-medium tracking-wider text-primary uppercase">Documentation</span>
        </div>
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-white">
          Documentation Hub
        </h1>
        <p className="max-w-lg text-sm text-[#64748B]">
          Everything you need to understand Enigma — the reputation and trust layer for autonomous agents on Avalanche.
        </p>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {docCards.map((card) => {
          const Icon = card.icon;
          const isExternal = card.external;
          const isComingSoon = !!card.badge;

          const inner = (
            <>
              {/* Icon */}
              <div
                className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
                style={{
                  background: `${card.accentColor}12`,
                  border: `1px solid ${card.accentColor}25`,
                }}
              >
                <Icon className="h-5 w-5" style={{ color: card.accentColor }} />
              </div>

              {/* Title + badge */}
              <div className="mb-2 flex items-center gap-2">
                <h2 className="text-sm font-semibold text-white">{card.title}</h2>
                {card.badge && (
                  <span className={cn(
                    'rounded-sm px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide',
                    'bg-[rgba(255,255,255,0.05)] text-[#475569]',
                  )}>
                    {card.badge}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="flex-1 text-xs leading-relaxed text-[#64748B]">
                {card.description}
              </p>

              {/* CTA arrow */}
              {!isComingSoon && (
                <div className="mt-4 flex items-center gap-1 text-xs font-medium" style={{ color: card.accentColor }}>
                  {isExternal ? (
                    <>View reference <ExternalLink className="h-3 w-3" /></>
                  ) : (
                    <>Read more <ArrowRight className="h-3 w-3" /></>
                  )}
                </div>
              )}
            </>
          );

          const cardClass = cn(
            'glass flex flex-col p-5 transition-all duration-150',
            isComingSoon
              ? 'cursor-default opacity-70'
              : 'hover:border-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.04)]',
          );

          if (isComingSoon) {
            return (
              <div key={card.title} className={cardClass}>
                {inner}
              </div>
            );
          }

          return (
            <Link key={card.title} href={card.href as '/'} className={cardClass}>
              {inner}
            </Link>
          );
        })}
      </div>

      {/* Quick info strip */}
      <div className={cn(
        'mt-10 rounded-xl border border-[rgba(255,255,255,0.06)] p-5',
        'bg-[rgba(255,255,255,0.02)]',
      )}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Need help?</p>
            <p className="mt-0.5 text-xs text-[#64748B]">
              Join the community on Telegram or check the API reference to get started quickly.
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href="https://t.me/enigma_avax"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold',
                'border border-[rgba(74,222,128,0.25)] bg-[rgba(74,222,128,0.08)] text-primary',
                'hover:bg-[rgba(74,222,128,0.14)] transition-all',
              )}
            >
              <ExternalLink className="h-3 w-3" />
              Telegram
            </a>
            <Link
              href="/docs/api"
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold',
                'border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-white',
                'hover:bg-[rgba(255,255,255,0.08)] transition-all',
              )}
            >
              API Docs
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
