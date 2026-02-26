'use client';

import { Search, Plus, Filter, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  variant?: 'no-agents' | 'no-results' | 'filtered';
  onResetFilters?: () => void;
}

/**
 * Empty state component for the Scanner page
 * Shows contextual message and CTA based on the reason for empty state
 */
export function EmptyState({ variant = 'no-agents', onResetFilters }: EmptyStateProps) {
  const content = {
    'no-agents': {
      icon: Plus,
      title: 'No agents registered yet',
      description: 'Be the first to register an autonomous agent on Enigma.',
      cta: {
        label: 'Register Agent',
        href: '/register' as const,
      },
    },
    'no-results': {
      icon: Search,
      title: 'No agents found',
      description: 'Try adjusting your search terms or filters.',
      cta: null,
    },
    'filtered': {
      icon: Filter,
      title: 'No matching agents',
      description: 'No agents match your current filters.',
      cta: null,
    },
  } as const;

  const { icon: Icon, title, description, cta } = content[variant];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(255,255,255,0.05)] mb-6">
        <Icon className="h-8 w-8 text-[rgba(255,255,255,0.4)]" />
      </div>

      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>

      <p className="text-sm text-[rgba(255,255,255,0.6)] text-center max-w-sm mb-6">
        {description}
      </p>

      <div className="flex flex-col items-center gap-3">
        <div className="flex gap-3">
          {cta && (
            <Button asChild>
              <Link href={cta.href}>
                <Plus className="mr-2 h-4 w-4" />
                {cta.label}
              </Link>
            </Button>
          )}

          {(variant === 'no-results' || variant === 'filtered') && onResetFilters && (
            <Button variant="outline" onClick={onResetFilters}>
              <Filter className="mr-2 h-4 w-4" />
              Reset Filters
            </Button>
          )}
        </div>

        {variant === 'no-agents' && (
          <Link
            href="/docs#register"
            className="inline-flex items-center gap-1.5 text-xs text-[#A78BFA] hover:text-[#C4B5FD] transition-colors"
          >
            <BookOpen className="h-3 w-3" />
            Learn how to register
          </Link>
        )}
      </div>
    </div>
  );
}
