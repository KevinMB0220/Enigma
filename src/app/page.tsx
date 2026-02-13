import Link from 'next/link';
import { Search, ArrowRight } from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { prisma } from '@/lib/database/prisma';
import { StatsSection, FeaturesSection, HowItWorksSection, CTASection } from '@/components/home';
import { VisitorStats } from '@/components/shared/visitor-stats';

export const dynamic = 'force-dynamic';

async function getHomeStats() {
  const [totalAgents, verifiedAgents, avgResult, volumeResult] = await Promise.all([
    prisma.agent.count(),
    prisma.agent.count({ where: { status: 'VERIFIED' } }),
    prisma.agent.aggregate({ _avg: { trust_score: true } }),
    prisma.transactionVolume.aggregate({
      _sum: { volumeUsd: true },
      where: { period: 'DAY' },
    }),
  ]);

  const avgTrustScore = Math.round(avgResult._avg.trust_score ?? 0);
  const volume24h = Number(volumeResult._sum.volumeUsd ?? 0);

  let volumeDisplay: string;
  if (volume24h >= 1_000_000) {
    volumeDisplay = `$${(volume24h / 1_000_000).toFixed(1)}M`;
  } else if (volume24h >= 1_000) {
    volumeDisplay = `$${(volume24h / 1_000).toFixed(1)}K`;
  } else {
    volumeDisplay = `$${volume24h.toFixed(0)}`;
  }

  return { totalAgents, verifiedAgents, avgTrustScore, volumeDisplay };
}

export default async function HomePage() {
  const stats = await getHomeStats();

  return (
    <>
      <Header />

      {/* =================== HERO =================== */}
      <section className="relative flex min-h-[85vh] flex-col items-center justify-center px-6 text-center">
        {/* Spotlight glow */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: 800,
            height: 800,
            background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border-light bg-glass px-4 py-1.5 text-sm text-text-secondary animate-fade-in-down">
            <span className="h-2 w-2 rounded-full bg-status-success animate-pulse" />
            Live on Avalanche
          </div>

          <h1 className="mb-6 text-hero-mobile font-extrabold tracking-tight text-white lg:text-hero animate-fade-in-up">
            Trust Score for{' '}
            <span className="bg-gradient-to-r from-primary to-[#60A5FA] bg-clip-text text-transparent">
              Autonomous Agents
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-text-secondary animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Discover, verify, and monitor autonomous smart contract agents on Avalanche.
            Enigma provides real-time trust scoring powered by on-chain analysis and community feedback.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <Link
              href="/scanner"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-dark px-8 py-3.5 font-semibold text-white shadow-primary transition-all hover:-translate-y-0.5 hover:shadow-primary-hover btn-press animate-pulse-glow"
            >
              Explore Agents
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/scanner"
              className="inline-flex items-center gap-2 rounded-lg border border-border-light bg-transparent px-8 py-3.5 font-semibold text-white transition-all hover:border-border-primary hover:bg-glass btn-press hover-glow"
            >
              <Search size={18} />
              Scanner
            </Link>
          </div>
        </div>
      </section>

      {/* Scroll-triggered sections */}
      <StatsSection
        totalAgents={stats.totalAgents}
        verifiedAgents={stats.verifiedAgents}
        volumeDisplay={stats.volumeDisplay}
        avgTrustScore={stats.avgTrustScore}
      />

      <FeaturesSection />

      <HowItWorksSection />

      <CTASection />

      {/* Visitor Statistics */}
      <section className="flex justify-center px-6 py-12">
        <VisitorStats />
      </section>

      <Footer />
    </>
  );
}
