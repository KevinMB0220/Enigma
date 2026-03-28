'use client';

import { useState, useEffect, useRef } from 'react';
import { X, HelpCircle, ArrowRight, Loader2 } from 'lucide-react';
import { useTour } from './use-tour';
import { useTourState, type TourPage } from './tour-provider';
import { cn } from '@/lib/utils';
import { IndustrialCorner } from '@/components/shared/industrial-corner';

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
    description: 'Take a tour to understand how FLARE works.',
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

  useEffect(() => {
    isReadyRef.current = isReady;
  }, [isReady]);

  useEffect(() => {
    if (isCompleted || isCtaDismissed(page)) {
      setIsVisible(false);
      return;
    }
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 800);
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
      const checkReady = setInterval(() => {
        if (isReadyRef.current) {
          clearInterval(checkReady);
          setIsStarting(false);
          startTourAndClose();
        }
      }, 100);
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
        isAnimatingOut ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100',
        className
      )}
    >
      {/* Industrial Toast Container */}
      <div
        className={cn(
          'relative overflow-hidden rounded-none',
          'bg-[#0F1219] p-8',
          'border border-[#4ADE80]/20 shadow-[0_24px_60px_rgba(0,0,0,1)]',
        )}
      >
        <IndustrialCorner position="top-right" size={20} color="#4ADE80" opacity={0.2} />
        
        {/* Close Button - Industrial Style */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 h-6 w-6 flex items-center justify-center border border-[#4ADE80]/10 bg-[#4ADE80]/5 text-[#4ADE80]/40 hover:text-[#4ADE80] transition-all"
        >
          <X className="h-3 w-3" />
        </button>

        <div className="flex gap-6">
           {/* Visual ID Badge */}
           <div className="h-10 w-10 shrink-0 border border-[#4ADE80]/30 bg-[#4ADE80]/5 flex items-center justify-center">
              <span className="font-mono text-xl font-black text-[#4ADE80]">?</span>
           </div>

           <div className="flex-1 min-w-0">
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#4ADE80] mb-2">{displayTitle}</h3>
              <p className="text-[11px] font-medium text-[#64748B] uppercase tracking-tight leading-relaxed mb-6">{displayDescription}</p>
              
              <button
                onClick={handleStartTour}
                disabled={isStarting}
                className={cn(
                  "h-10 px-6 flex items-center gap-3 bg-[#4ADE80] text-[#05070A] font-black uppercase tracking-widest text-[10px] hover:brightness-110 active:scale-95 transition-all w-full justify-center",
                  "shadow-[0_0_20px_rgba(74,222,128,0.2)] disabled:opacity-50"
                )}
              >
                 {isStarting ? "SYNCING..." : "INITIALIZE_TOUR"}
                 {!isStarting && <ArrowRight className="h-3.5 w-3.5" />}
              </button>
           </div>
        </div>

        {/* Binary Footer Label */}
        <div className="mt-6 flex items-center gap-3 justify-end opacity-20">
           <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#4ADE80]/20" />
           <span className="text-[8px] font-mono font-black text-[#4ADE80]">TOUR_SEQUENCE_v4.0</span>
        </div>
      </div>
    </div>
  );
}
