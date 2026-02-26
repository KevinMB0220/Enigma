import type { StepOptions } from 'shepherd.js';

export function getDocsTourSteps(): StepOptions[] {
  return [
    // Step 1: Welcome
    {
      id: 'docs-welcome',
      title: 'Documentation',
      text: 'Learn how Enigma works: trust scores, ERC-8004 registry, agent metadata, and the REST API.',
      buttons: [
        {
          text: 'Skip',
          classes: 'shepherd-button-secondary',
          action() {
            this.cancel();
          },
        },
        {
          text: 'Start',
          classes: 'shepherd-button-primary',
          action() {
            this.next();
          },
        },
      ],
    },

    // Step 2: Table of Contents
    {
      id: 'docs-toc',
      title: 'Navigation',
      text: 'Use this sidebar to jump between sections. On mobile, scroll the horizontal tabs at the top.',
      attachTo: {
        element: '[data-tour="docs-toc"]',
        on: 'right',
      },
      buttons: [
        {
          text: 'Back',
          classes: 'shepherd-button-secondary',
          action() {
            this.back();
          },
        },
        {
          text: 'Next',
          classes: 'shepherd-button-primary',
          action() {
            this.next();
          },
        },
      ],
    },

    // Step 3: Trust Score Section
    {
      id: 'docs-trust-score',
      title: 'Trust Score System',
      text: 'This section explains how trust scores are calculated using 5 weighted signals: verification, ratings, activity, reports, and longevity.',
      attachTo: {
        element: '[data-tour="docs-trust"]',
        on: 'bottom',
      },
      buttons: [
        {
          text: 'Back',
          classes: 'shepherd-button-secondary',
          action() {
            this.back();
          },
        },
        {
          text: 'Next',
          classes: 'shepherd-button-primary',
          action() {
            this.next();
          },
        },
      ],
    },

    // Step 4: API Reference
    {
      id: 'docs-api',
      title: 'API Reference',
      text: 'All data is available via REST API at /api/v1. No authentication needed for read endpoints.',
      attachTo: {
        element: '[data-tour="docs-api"]',
        on: 'top',
      },
      buttons: [
        {
          text: 'Back',
          classes: 'shepherd-button-secondary',
          action() {
            this.back();
          },
        },
        {
          text: 'Next',
          classes: 'shepherd-button-primary',
          action() {
            this.next();
          },
        },
      ],
    },

    // Step 5: Help Button
    {
      id: 'docs-help-button',
      title: 'Need Help Again?',
      text: 'You can restart this tour anytime by clicking the help button here.',
      attachTo: {
        element: '[data-tour="help-button"]',
        on: 'bottom',
      },
      buttons: [
        {
          text: 'Back',
          classes: 'shepherd-button-secondary',
          action() {
            this.back();
          },
        },
        {
          text: 'Done!',
          classes: 'shepherd-button-primary',
          action() {
            this.complete();
          },
        },
      ],
    },
  ];
}
