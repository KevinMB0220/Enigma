'use client';

import { useCallback, useRef, useEffect, useState } from 'react';
import { useTourState, type TourPage } from './tour-provider';
import { getScannerTourSteps } from './tours/scanner-tour';
import { getRegisterTourSteps } from './tours/register-tour';
import { getDocsTourSteps } from './tours/docs-tour';
import { getAgentTourSteps } from './tours/agent-tour';

const tourStepGetters: Record<TourPage, () => import('shepherd.js').StepOptions[]> = {
  scanner: getScannerTourSteps,
  register: getRegisterTourSteps,
  docs: getDocsTourSteps,
  agent: getAgentTourSteps,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ShepherdType = any;

// Helper to wait for an element to exist in the DOM
function waitForElement(selector: string, timeout = 10000): Promise<Element | null> {
  return new Promise((resolve) => {
    // Check immediately
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

    const startTime = Date.now();

    // Use both MutationObserver and polling for reliability
    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        observer.disconnect();
        clearInterval(pollInterval);
        resolve(el);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Also poll every 200ms as backup
    const pollInterval = setInterval(() => {
      const el = document.querySelector(selector);
      if (el) {
        observer.disconnect();
        clearInterval(pollInterval);
        resolve(el);
      } else if (Date.now() - startTime > timeout) {
        observer.disconnect();
        clearInterval(pollInterval);
        resolve(null);
      }
    }, 200);

    // Final timeout
    setTimeout(() => {
      observer.disconnect();
      clearInterval(pollInterval);
      resolve(document.querySelector(selector));
    }, timeout);
  });
}

export function useTour(page: TourPage) {
  const { markTourCompleted, isTourCompleted } = useTourState();
  const tourRef = useRef<ShepherdType | null>(null);
  const shepherdRef = useRef<ShepherdType | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Dynamically import Shepherd on client side only
  useEffect(() => {
    let mounted = true;
    import('shepherd.js').then((mod) => {
      if (mounted) {
        shepherdRef.current = mod.default;
        setIsReady(true);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const startTour = useCallback(async () => {
    const Shepherd = shepherdRef.current;
    if (!Shepherd || tourRef.current) return;

    // Get steps for this page
    const steps = tourStepGetters[page]();

    // Find the first step with an attachTo element (after welcome step)
    const firstAttachedStep = steps.find(s => s.attachTo?.element);
    if (firstAttachedStep?.attachTo?.element) {
      const selector = firstAttachedStep.attachTo.element as string;
      // Wait for the first element to exist before starting the tour
      await waitForElement(selector);
      // Extra delay to ensure page is fully rendered
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    // Create a new Tour instance with options
    const tour = new Shepherd.Tour({
      useModalOverlay: true,
      defaultStepOptions: {
        classes: 'shepherd-enigma',
        scrollTo: { behavior: 'smooth', block: 'center' },
        cancelIcon: { enabled: true },
        modalOverlayOpeningPadding: 8,
        modalOverlayOpeningRadius: 0,
      },
    });

    tourRef.current = tour;

    // Add steps with element waiting
    steps.forEach((step) => {
      // If step has an attachTo element, add beforeShowPromise to wait for it
      if (step.attachTo?.element && typeof step.attachTo.element === 'string') {
        const selector = step.attachTo.element;

        step.beforeShowPromise = async function() {
          const element = await waitForElement(selector);
          // Small delay to ensure element is fully rendered
          await new Promise(resolve => setTimeout(resolve, 100));

          // If element still not found after waiting, show step centered
          if (!element) {
            // @ts-expect-error - modifying step at runtime
            this.options.attachTo = undefined;
          }
        };
      }

      tour.addStep(step);
    });

    // Listen for completion/cancel
    tour.on('complete', () => {
      markTourCompleted(page);
      tourRef.current = null;
    });
    tour.on('cancel', () => {
      tourRef.current = null;
    });

    // Start the tour
    tour.start();
  }, [page, markTourCompleted]);

  const stopTour = useCallback(() => {
    if (tourRef.current) {
      tourRef.current.cancel();
      tourRef.current = null;
    }
  }, []);

  return {
    startTour,
    stopTour,
    isCompleted: isTourCompleted(page),
    isActive: !!tourRef.current,
    isReady,
  };
}
