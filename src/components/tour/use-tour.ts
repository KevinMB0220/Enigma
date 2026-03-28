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
function waitForElement(selector: string, timeout = 5000): Promise<Element | null> {
  return new Promise((resolve) => {
    // Check immediately
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

    const startTime = Date.now();

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
  });
}

export function useTour(page: TourPage) {
  const { markTourCompleted, isTourCompleted } = useTourState();
  const tourRef = useRef<ShepherdType | null>(null);
  const shepherdRef = useRef<ShepherdType | null>(null);
  const [isReady, setIsReady] = useState(false);

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

    const steps = tourStepGetters[page]();

    // Create tour instance
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

    // Process steps
    steps.forEach((stepOptions) => {
      const stepObj = { ...stepOptions };
      const selector = stepObj.attachTo?.element;

      if (selector && typeof selector === 'string') {
        // Use standard function to ensure proper 'this' binding from Shepherd
        stepObj.beforeShowPromise = async function() {
          const element = await waitForElement(selector);
          
          // Defensive check for 'this' and its options
          // In some environments, Shepherd's 'this' might be different or we might be in an arrow context
          const currentStep = this as any;
          if (!element && currentStep && currentStep.options) {
            currentStep.options.attachTo = undefined;
          }
        };
      }

      tour.addStep(stepObj);
    });

    tour.on('complete', () => {
      markTourCompleted(page);
      tourRef.current = null;
    });
    
    tour.on('cancel', () => {
      tourRef.current = null;
    });

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
