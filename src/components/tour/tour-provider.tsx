'use client';

import { createContext, useContext, useCallback, useState, useEffect, type ReactNode } from 'react';
import 'shepherd.js/dist/css/shepherd.css';
import '@/styles/shepherd-flare.css';

// LocalStorage keys
const STORAGE_KEYS = {
  SCANNER_COMPLETED: 'flare_tour_scanner_completed',
  REGISTER_COMPLETED: 'flare_tour_register_completed',
  DOCS_COMPLETED: 'flare_tour_docs_completed',
  AGENT_COMPLETED: 'flare_tour_agent_completed',
  CTA_DISMISSED: 'flare_tour_cta_dismissed',
  VERSION: 'flare_tour_version',
} as const;

const CURRENT_TOUR_VERSION = '1.1.0';

export type TourPage = 'scanner' | 'register' | 'docs' | 'agent';

interface TourContextValue {
  isTourCompleted: (page: TourPage) => boolean;
  markTourCompleted: (page: TourPage) => void;
  resetTourProgress: () => void;
  isCtaDismissed: (page: TourPage) => boolean;
  dismissCta: (page: TourPage) => void;
}

const TourStateContext = createContext<TourContextValue | null>(null);

interface TourProviderProps {
  children: ReactNode;
}

export function TourProvider({ children }: TourProviderProps) {
  const [completedTours, setCompletedTours] = useState<Record<TourPage, boolean>>({
    scanner: false,
    register: false,
    docs: false,
    agent: false,
  });
  const [dismissedCtas, setDismissedCtas] = useState<Record<TourPage, boolean>>({
    scanner: false,
    register: false,
    docs: false,
    agent: false,
  });

  // Load persisted state on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check version and reset if needed
    const storedVersion = localStorage.getItem(STORAGE_KEYS.VERSION);
    if (storedVersion !== CURRENT_TOUR_VERSION) {
      Object.values(STORAGE_KEYS).forEach((key) => {
        if (key !== STORAGE_KEYS.VERSION) {
          localStorage.removeItem(key);
        }
      });
      localStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_TOUR_VERSION);
    }

    setCompletedTours({
      scanner: localStorage.getItem(STORAGE_KEYS.SCANNER_COMPLETED) === 'true',
      register: localStorage.getItem(STORAGE_KEYS.REGISTER_COMPLETED) === 'true',
      docs: localStorage.getItem(STORAGE_KEYS.DOCS_COMPLETED) === 'true',
      agent: localStorage.getItem(STORAGE_KEYS.AGENT_COMPLETED) === 'true',
    });

    // Load dismissed CTAs
    const dismissedData = localStorage.getItem(STORAGE_KEYS.CTA_DISMISSED);
    if (dismissedData) {
      try {
        setDismissedCtas(JSON.parse(dismissedData));
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  const isTourCompleted = useCallback(
    (page: TourPage) => {
      return completedTours[page];
    },
    [completedTours]
  );

  const markTourCompleted = useCallback((page: TourPage) => {
    const keyMap: Record<TourPage, string> = {
      scanner: STORAGE_KEYS.SCANNER_COMPLETED,
      register: STORAGE_KEYS.REGISTER_COMPLETED,
      docs: STORAGE_KEYS.DOCS_COMPLETED,
      agent: STORAGE_KEYS.AGENT_COMPLETED,
    };
    localStorage.setItem(keyMap[page], 'true');
    setCompletedTours((prev) => ({ ...prev, [page]: true }));
  }, []);

  const isCtaDismissed = useCallback(
    (page: TourPage) => {
      return dismissedCtas[page];
    },
    [dismissedCtas]
  );

  const dismissCta = useCallback((page: TourPage) => {
    setDismissedCtas((prev) => {
      const updated = { ...prev, [page]: true };
      localStorage.setItem(STORAGE_KEYS.CTA_DISMISSED, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const resetTourProgress = useCallback(() => {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
    localStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_TOUR_VERSION);
    setCompletedTours({ scanner: false, register: false, docs: false, agent: false });
    setDismissedCtas({ scanner: false, register: false, docs: false, agent: false });
  }, []);

  return (
    <TourStateContext.Provider
      value={{
        isTourCompleted,
        markTourCompleted,
        resetTourProgress,
        isCtaDismissed,
        dismissCta,
      }}
    >
      {children}
    </TourStateContext.Provider>
  );
}

export function useTourState() {
  const context = useContext(TourStateContext);
  if (!context) {
    throw new Error('useTourState must be used within a TourProvider');
  }
  return context;
}
