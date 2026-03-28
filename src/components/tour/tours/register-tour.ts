import type { StepOptions } from 'shepherd.js';

export function getRegisterTourSteps(): StepOptions[] {
  return [
    // Step 1: Introduction
    {
      id: 'register-intro',
      title: 'Register Your Agent',
      text: 'This form lets you add your autonomous agent to FLARE. Once registered, it will be indexed and receive a trust score.',
      buttons: [
        {
          text: 'Skip',
          classes: 'shepherd-button-secondary',
          action() {
            this.cancel();
          },
        },
        {
          text: 'Continue',
          classes: 'shepherd-button-primary',
          action() {
            this.next();
          },
        },
      ],
    },

    // Step 2: Wallet Connection
    {
      id: 'register-wallet',
      title: 'Connect Wallet',
      text: 'First, connect your wallet. This verifies you own the agent address and enables on-chain registration.',
      attachTo: {
        element: '[data-tour="register-wallet"]',
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

    // Step 3: Agent Address
    {
      id: 'register-address',
      title: 'Agent Address',
      text: "Enter your agent's smart contract address on Avalanche. This must be a valid 0x address.",
      attachTo: {
        element: '[data-tour="register-address"]',
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

    // Step 4: Agent Type
    {
      id: 'register-type',
      title: 'Select Agent Type',
      text: 'Choose the category that best describes your agent: Trading, Lending, Governance, Oracle, or Custom.',
      attachTo: {
        element: '[data-tour="register-type"]',
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

    // Step 5: Submit
    {
      id: 'register-submit',
      title: 'Submit Registration',
      text: 'Once all fields are complete, click here to register. Your agent will appear in the scanner after the next indexer cycle.',
      attachTo: {
        element: '[data-tour="register-submit"]',
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

    // Step 6: Help Button
    {
      id: 'register-help-button',
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
