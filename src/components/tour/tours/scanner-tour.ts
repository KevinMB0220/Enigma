import type { StepOptions } from 'shepherd.js';

export function getScannerTourSteps(): StepOptions[] {
  return [
    // Step 1: Welcome
    {
      id: 'scanner-welcome',
      title: 'Welcome to Scanner',
      text: 'This is your command center for exploring AI agents on Avalanche. Let me show you around!',
      buttons: [
        {
          text: 'Skip Tour',
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

    // Step 2: KPI Cards
    {
      id: 'scanner-kpi-cards',
      title: 'Key Metrics',
      text: 'These cards show platform-wide statistics: total registered agents, verification rate, 24h activity, and average trust score.',
      attachTo: {
        element: '[data-tour="scanner-kpi"]',
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

    // Step 3: Search Bar
    {
      id: 'scanner-search',
      title: 'Search Agents',
      text: 'Search for agents by name or contract address. Results appear as you type with autocomplete.',
      attachTo: {
        element: '[data-tour="scanner-search"]',
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

    // Step 4: Agent Table
    {
      id: 'scanner-table',
      title: 'Agent Registry',
      text: 'Browse all registered AI agents. Each row shows name, trust score, service tags, and status at a glance.',
      attachTo: {
        element: '[data-tour="scanner-table"]',
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

    // Step 5: Click to open agent
    {
      id: 'scanner-agent-row',
      title: 'View Agent Details',
      text: '👆 Click on any agent row to open its dedicated profile page. There you\'ll find detailed trust scores, activity history, community ratings, and metadata.',
      attachTo: {
        element: '[data-tour="scanner-table"] table tbody tr:first-child',
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

    // Step 6: Filters (desktop only)
    {
      id: 'scanner-filters',
      title: 'Filter & Sort',
      text: 'Narrow down results by service type (MCP, A2A, web, OASF), status, trust score range, and sort order.',
      attachTo: {
        element: '[data-tour="scanner-filters"]',
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

    // Step 7: Help Button
    {
      id: 'scanner-help-button',
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
