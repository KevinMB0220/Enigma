'use client';

import { useState, useEffect, useRef } from 'react';
import { X, HelpCircle, ArrowRight, Loader2 } from 'lucide-react';
import { useTour } from './use-tour';
import { useTourState, type TourPage } from './tour-provider';
import { cn } from '@/lib/utils';

interface TourCtaProps {
  page: TourPage;
  title?: string;
  description?: string;
  className?: string;
}

const defaultMessages: Record<TourPage, { title: string; description: string }> = {
  scanner: {
    title: 'New here?',
    description: 'Take a quick tour to discover how to explore AI agents.',
  },
  register: {
    title: 'Ready to register?',
    description: 'Let us guide you through the registration process.',
  },
  docs: {
    title: 'First time?',
    description: 'Take a tour to understand how Enigma works.',
  },
  agent: {
    title: 'Agent Profile',
    description: 'Learn how to read trust scores and agent metrics.',
  },
};

export function TourCta({ page, title, description, className }: TourCtaProps) {
  const { startTour, isCompleted, isReady } = useTour(page);
  const { isCtaDismissed, dismissCta } = useTourState();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const isReadyRef = useRef(isReady);

  // Keep ref in sync with isReady
  useEffect(() => {
    isReadyRef.current = isReady;
  }, [isReady]);

  // Show CTA after a short delay if tour not completed and not dismissed
  useEffect(() => {
    if (isCompleted || isCtaDismissed(page)) {
      setIsVisible(false);
      return;
    }

    // Show immediately with a minimal delay for smoother UX
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500); // Show after 0.5s

    return () => clearTimeout(timer);
  }, [isCompleted, isCtaDismissed, page]);

  const handleDismiss = () => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      dismissCta(page);
      setIsVisible(false);
      setIsAnimatingOut(false);
    }, 300);
  };

  const startTourAndClose = () => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      dismissCta(page);
      setIsVisible(false);
      setIsAnimatingOut(false);
      startTour();
    }, 200);
  };

  const handleStartTour = () => {
    if (!isReadyRef.current) {
      setIsStarting(true);
      // Wait for Shepherd to be ready, then start
      const checkReady = setInterval(() => {
        if (isReadyRef.current) {
          clearInterval(checkReady);
          setIsStarting(false);
          startTourAndClose();
        }
      }, 100);
      // Timeout after 5 seconds
      setTimeout(() => {
        clearInterval(checkReady);
        setIsStarting(false);
      }, 5000);
      return;
    }
    startTourAndClose();
  };

  if (!isVisible) return null;

  const messages = defaultMessages[page];
  const displayTitle = title || messages.title;
  const displayDescription = description || messages.description;

  return (
    <div
      className={cn(
        'fixed bottom-8 right-8 z-[9998] max-w-sm',
        'transition-all duration-300 ease-out',
        isAnimatingOut
          ? 'translate-y-4 opacity-0'
          : 'translate-y-0 opacity-100',
        className
      )}
    >
      <div
        className={cn(
          'relative overflow-hidden rounded-none',
          'bg-[#0F1219]/98 backdrop-blur-xl',
          'border border-flare-accent/15 border-t-flare-accent/40',
          'shadow-[0_24px_60px_rgba(0,0,0,0.8),0_0_80px_-20px_rgba(74,222,128,0.1)]',
          'p-6'
        )}
      >
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className={cn(
            'absolute top-4 right-4',
            'flex h-6 w-6 items-center justify-center rounded-none',
            'bg-flare-accent/[0.03] border border-flare-accent/[0.08]',
            'text-[#64748B] hover:text-flare-accent hover:bg-flare-accent/[0.08] hover:border-flare-accent/20',
            'transition-all duration-200'
          )}
          aria-label="Dismiss"
        >
          <X className="h-3.5 w-3.5" />
        </button>

        {/* Content */}
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-none',
              'bg-flare-accent/10 border border-flare-accent/30 shadow-[0_0_20px_rgba(74,222,128,0.15)]'
            )}
          >
            <span className="font-mono text-[20px] font-black text-flare-accent mt-0.5">?</span>
          </div>

          {/* Text */}
          <div className="flex-1 pr-6">
            <h3 className="text-[12px] font-black text-flare-accent uppercase tracking-[0.2em] mb-1">
              {displayTitle}
            </h3>
            <p className="text-[11px] text-[#94A3B8] leading-relaxed mb-5 font-medium">
              {displayDescription}
            </p>

            {/* Action button */}
            <button
              onClick={handleStartTour}
              disabled={isStarting}
              className={cn(
                'inline-flex items-center gap-3 px-5 py-2.5 rounded-none',
                'bg-flare-accent text-[#05070A]',
                'text-[10px] font-black uppercase tracking-[0.2em]',
                'hover:bg-[#22C55E]',
                'hover:shadow-[0_0_20px_rgba(74,222,128,0.3)]',
                'transition-all duration-200',
                'disabled:opacity-70 disabled:cursor-wait',
                'group'
              )}
            >
              {isStarting ? 'Syncing...' : 'Initialize Tour'}
              {isStarting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              )}
            </button>
          </div>
        </div>

        {/* Technical metadata markers */}
        <div className="absolute bottom-4 left-6 flex gap-2">
          <div className="h-1 w-4 bg-flare-accent/40" />
          <div className="h-1 w-1 bg-flare-accent/20" />
          <div className="h-1 w-1 bg-flare-accent/10" />
        </div>
      </div>
    </div>
  );
}
