import type { StepOptions } from 'shepherd.js';

export function getAgentTourSteps(): StepOptions[] {
  return [
    // Step 1: Welcome
    {
      id: 'agent-welcome',
      title: 'Agent Profile Page',
      text: 'Welcome! This is the detailed profile of an AI agent. Here you can explore trust scores, activity history, community ratings, and technical metadata.',
      buttons: [
        {
          text: 'Skip',
          classes: 'shepherd-button-secondary',
          action() {
            this.cancel();
          },
        },
        {
          text: 'Start Tour',
          classes: 'shepherd-button-primary',
          action() {
            this.next();
          },
        },
      ],
    },

    // Step 2: Agent Header
    {
      id: 'agent-header',
      title: 'Agent Identity',
      text: 'This section shows the agent\'s name, avatar, type (AI/Bot), verification status, and supported protocols. The colored tags indicate which services this agent supports (MCP, A2A, web, OASF).',
      attachTo: {
        element: '[data-tour="agent-header"]',
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

    // Step 3: Trust Score
    {
      id: 'agent-trust-score',
      title: 'Trust Score',
      text: 'This is the agent\'s trust score (0-100). It\'s calculated from multiple signals: verification status, community ratings, on-chain activity, reports, and time since registration. Higher scores = more trustworthy.',
      attachTo: {
        element: '[data-tour="agent-score"]',
        on: 'left',
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

    // Step 4: Actions
    {
      id: 'agent-actions',
      title: 'Quick Actions',
      text: 'Use these buttons to: share a trust certificate on Twitter, embed a trust badge on your website, view the agent on the block explorer, or explore the Trust Graph visualization.',
      attachTo: {
        element: '[data-tour="agent-actions"]',
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

    // Step 5: Quick Stats
    {
      id: 'agent-stats',
      title: 'Key Metrics',
      text: 'Quick snapshot of important metrics: uptime percentage, 24-hour transaction volume, proxy type (transparent/opaque), average community rating, and how long the agent has been registered.',
      attachTo: {
        element: '[data-tour="agent-stats"]',
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

    // Step 6: Tabs
    {
      id: 'agent-tabs',
      title: 'Explore Sections',
      text: 'Use these tabs to explore different aspects:\n• Overview - Trust score breakdown\n• Activity - Heartbeats & events\n• Community - User ratings & reviews\n• Metadata - Technical details & JSON',
      attachTo: {
        element: '[data-tour="agent-tabs"]',
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

    // Step 7: Help Button
    {
      id: 'agent-help-button',
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
          text: 'Got it!',
          classes: 'shepherd-button-primary',
          action() {
            this.complete();
          },
        },
      ],
    },
  ];
}
