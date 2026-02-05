import { WalletConnectButton } from '@/components/shared';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="glass p-12 text-center">
        <h1 className="mb-4 text-hero-mobile font-extrabold tracking-tight text-white lg:text-hero">
          Enigma
        </h1>
        <p className="mb-8 max-w-2xl text-lg text-text-secondary">
          Discovery, Verification, and Trust Scoring Platform for Autonomous Agents on Avalanche
        </p>
        <div className="flex gap-4 justify-center">
          <button className="rounded-lg bg-gradient-to-r from-primary to-primary-dark px-6 py-3 font-semibold text-white shadow-primary transition-all hover:-translate-y-0.5 hover:shadow-primary-hover">
            Explore Agents
          </button>
          <WalletConnectButton className="rounded-lg border border-border-light bg-transparent px-6 py-3 font-semibold text-white transition-all hover:border-border-primary hover:bg-glass" />
        </div>
      </div>

      {/* Status indicator */}
      <div className="mt-12 flex items-center gap-2 text-sm text-text-muted">
        <span className="h-2 w-2 rounded-full bg-status-success animate-pulse" />
        Project initialized - Ready for development
      </div>
    </main>
  );
}
