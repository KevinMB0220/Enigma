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
        'fixed bottom-6 right-6 z-[9998] max-w-sm',
        'transition-all duration-300 ease-out',
        isAnimatingOut
          ? 'translate-y-4 opacity-0 scale-95'
          : 'translate-y-0 opacity-100 scale-100',
        className
      )}
    >
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl',
          'bg-gradient-to-br from-[rgba(20,28,38,0.98)] to-[rgba(12,18,26,0.98)]',
          'backdrop-blur-xl',
          'border border-[rgba(255,255,255,0.1)]',
          'shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_60px_-10px_rgba(74,222,128,0.2)]',
          'p-5'
        )}
      >
        {/* Accent gradient line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[rgba(74,222,128,0.6)] to-transparent" />

        {/* Close button */}
        <button
          onClick={handleDismiss}
          className={cn(
            'absolute top-3 right-3',
            'flex h-7 w-7 items-center justify-center rounded-lg',
            'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)]',
            'text-[#64748B] hover:text-white hover:bg-[rgba(255,255,255,0.1)]',
            'transition-all duration-200'
          )}
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Content */}
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
              'bg-gradient-to-br from-[rgba(74,222,128,0.2)] to-[rgba(34,211,238,0.1)]',
              'border border-[rgba(74,222,128,0.3)]'
            )}
          >
            <HelpCircle className="h-5 w-5 text-[#4ADE80]" />
          </div>

          {/* Text */}
          <div className="flex-1 pr-6">
            <h3 className="text-sm font-semibold text-white mb-1">
              {displayTitle}
            </h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed mb-4">
              {displayDescription}
            </p>

            {/* Action button */}
            <button
              onClick={handleStartTour}
              disabled={isStarting}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-lg',
                'bg-gradient-to-r from-[rgba(74,222,128,0.15)] to-[rgba(74,222,128,0.1)]',
                'border border-[rgba(74,222,128,0.3)]',
                'text-[#4ADE80] text-xs font-semibold',
                'hover:from-[rgba(74,222,128,0.25)] hover:to-[rgba(74,222,128,0.15)]',
                'hover:border-[rgba(74,222,128,0.5)]',
                'hover:shadow-[0_0_20px_rgba(74,222,128,0.2)]',
                'transition-all duration-200',
                'disabled:opacity-70 disabled:cursor-wait',
                'group'
              )}
            >
              {isStarting ? 'Loading...' : 'Take the Tour'}
              {isStarting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              )}
            </button>
          </div>
        </div>

        {/* Decorative dots */}
        <div className="absolute bottom-3 left-5 flex gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-[rgba(74,222,128,0.4)]" />
          <div className="h-1.5 w-1.5 rounded-full bg-[rgba(74,222,128,0.25)]" />
          <div className="h-1.5 w-1.5 rounded-full bg-[rgba(74,222,128,0.15)]" />
        </div>
      </div>
    </div>
  );
}
