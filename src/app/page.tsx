import Link from 'next/link';
import { Shield, Activity, Search, Code2, ArrowRight, Zap, Eye, BarChart3 } from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { prisma } from '@/lib/database/prisma';

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

      {/* =================== STATS =================== */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Total Agents', value: stats.totalAgents, icon: Code2 },
            { label: 'Verified', value: stats.verifiedAgents, icon: Shield },
            { label: 'Volume 24h', value: stats.volumeDisplay, icon: BarChart3 },
            { label: 'Avg Trust Score', value: stats.avgTrustScore, icon: Activity },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="glass group p-6 text-center interactive-card animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <stat.icon className="mx-auto mb-3 h-6 w-6 text-primary transition-transform group-hover:scale-110" />
              <div className="text-stat font-bold text-white number-animate">{stat.value}</div>
              <div className="mt-1 text-sm text-text-secondary">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* =================== FEATURES =================== */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-20">
        <div className="mb-16 text-center animate-fade-in-up">
          <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
            Why Enigma?
          </h2>
          <p className="mx-auto max-w-2xl text-text-secondary">
            A comprehensive platform for evaluating and monitoring autonomous agents on Avalanche.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              icon: Shield,
              title: 'Trust Score',
              description:
                'Multi-factor scoring combining on-chain volume, proxy detection, uptime monitoring, OpenZeppelin compliance, and community ratings.',
            },
            {
              icon: Eye,
              title: 'Centinela Verification',
              description:
                'Automated contract analysis engine that monitors heartbeat, detects proxy patterns, and matches against known OpenZeppelin implementations.',
            },
            {
              icon: Zap,
              title: 'Real-time Monitoring',
              description:
                'Continuous heartbeat checks, uptime tracking, and volume analysis ensure you always have the latest data on agent health.',
            },
          ].map((feature, index) => (
            <div
              key={feature.title}
              className="glass group p-8 interactive-card gradient-border animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="mb-4 inline-flex rounded-lg bg-[rgba(59,130,246,0.1)] p-3 transition-all group-hover:bg-[rgba(59,130,246,0.2)] group-hover:scale-110">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-text-secondary">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =================== HOW IT WORKS =================== */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-20">
        <div className="mb-16 text-center animate-fade-in-up">
          <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
            How It Works
          </h2>
          <p className="mx-auto max-w-2xl text-text-secondary">
            Three simple steps to evaluate the trustworthiness of any autonomous agent.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              step: '01',
              title: 'Discover',
              description:
                'Browse the Scanner to find autonomous agents registered on Avalanche. Filter by type, status, or trust score.',
            },
            {
              step: '02',
              title: 'Verify',
              description:
                'Centinela analyzes each agent for proxy patterns, OpenZeppelin compliance, and uptime to generate a Trust Score.',
            },
            {
              step: '03',
              title: 'Monitor',
              description:
                'Track agent health over time with heartbeat monitoring, volume analysis, and community ratings.',
            },
          ].map((item) => (
            <div key={item.step} className="relative text-center group hover-lift p-6 animate-fade-in-up" style={{ animationDelay: `${(['01', '02', '03'].indexOf(item.step)) * 150}ms` }}>
              <div className="mb-4 text-5xl font-extrabold text-primary/20 transition-all group-hover:text-primary/40 group-hover:scale-110 number-animate">
                {item.step}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">{item.title}</h3>
              <p className="text-sm leading-relaxed text-text-secondary">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =================== CTA =================== */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 py-20">
        <div className="glass overflow-hidden p-12 text-center interactive-card hover-glow animate-scale-in">
          <div
            className="pointer-events-none absolute inset-0 animate-pulse-glow"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.08) 0%, transparent 70%)',
            }}
            aria-hidden="true"
          />
          <div className="relative">
            <h2 className="mb-4 text-3xl font-bold text-white">
              Ready to explore?
            </h2>
            <p className="mx-auto mb-8 max-w-lg text-text-secondary">
              Start discovering and verifying autonomous agents on Avalanche today.
            </p>
            <Link
              href="/scanner"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-dark px-8 py-3.5 font-semibold text-white shadow-primary transition-all hover:-translate-y-0.5 hover:shadow-primary-hover btn-press"
            >
              Launch Scanner
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
