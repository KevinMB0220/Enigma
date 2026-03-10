import Link from 'next/link';
import { unstable_cache } from 'next/cache';
import { ArrowRight, ShieldCheck, Activity, Cpu, MessageCircle } from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { prisma } from '@/lib/database/prisma';
import { FeaturesSection, HowItWorksSection, CTASection } from '@/components/home';
import { VisitorStats } from '@/components/shared/visitor-stats';
import { cn } from '@/lib/utils';

export const revalidate = 60;

const getHomeStats = unstable_cache(
  async () => {
    const [total, verified, avgResult, recentAgents] = await Promise.all([
      prisma.agent.count(),
      prisma.agent.count({ where: { status: 'VERIFIED' } }),
      prisma.agent.aggregate({ _avg: { trust_score: true } }),
      prisma.agent.findMany({
        take: 3,
        orderBy: { created_at: 'desc' },
        select: { name: true, trust_score: true, status: true, address: true },
      }),
    ]);

    return {
      total,
      verified,
      avgTrustScore: Math.round(avgResult._avg.trust_score ?? 0),
      verifiedPct: total > 0 ? Math.round((verified / total) * 100) : 0,
      recentAgents,
    };
  },
  ['home-stats'],
  { revalidate: 60, tags: ['agents'] }
);

function TrustBadge({ score }: { score: number }) {
  const color = score >= 80 ? '#4ADE80' : score >= 60 ? '#22D3EE' : score >= 40 ? '#FCD34D' : '#FB7185';
  const label = score >= 80 ? 'High' : score >= 60 ? 'Medium' : 'Low';
  return (
    <span
      className="font-data rounded-md px-1.5 py-0.5 text-[10px] font-bold"
      style={{ background: `${color}18`, color }}
    >
      {label} · {score}
    </span>
  );
}

export default async function HomePage() {
  const stats = await getHomeStats();

  return (
    <>
      <Header />

      {/* HERO */}
      <section className="relative flex min-h-[88vh] flex-col items-center justify-center overflow-hidden px-6 pb-20 text-center">

        {/* Background glows */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: 700,
            height: 700,
            background: 'radial-gradient(circle, rgba(74,222,128,0.07) 0%, transparent 65%)',
            filter: 'blur(40px)',
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute right-1/4 top-1/4"
          style={{
            width: 400,
            height: 400,
            background: 'radial-gradient(circle, rgba(34,211,238,0.05) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-5xl">

          {/* Network status bar */}
          <div className="mb-10 flex flex-wrap items-center justify-center gap-4">
            <div className={cn(
              'flex items-center gap-2 rounded-full border px-3.5 py-1.5',
              'border-[rgba(74,222,128,0.2)] bg-[rgba(74,222,128,0.06)]',
            )}>
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[12px] font-medium text-primary">Live · Avalanche Mainnet</span>
            </div>
            <div className="hidden items-center gap-5 sm:flex">
              <span className="font-data text-[12px] text-[#64748B]">
                <span className="font-semibold text-white">{stats.total}</span> agents indexed
              </span>
              <span className="h-3 w-px bg-[rgba(255,255,255,0.08)]" />
              <span className="font-data text-[12px] text-[#64748B]">
                <span className="font-semibold text-primary">{stats.verifiedPct}%</span> verified
              </span>
              <span className="h-3 w-px bg-[rgba(255,255,255,0.08)]" />
              <span className="font-data text-[12px] text-[#64748B]">
                avg score <span className="font-semibold text-white">{stats.avgTrustScore}</span>
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="mb-5 text-5xl font-extrabold leading-[1.1] tracking-tight text-white lg:text-7xl">
            The Reputation Layer{' '}
            <br className="hidden sm:block" />
            for{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #4ADE80 0%, #22D3EE 100%)' }}
            >
              On-Chain Agents
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-xl text-[17px] leading-relaxed text-[#94A3B8]">
            Discover, verify, and monitor autonomous smart contract agents on Avalanche.
            Real-time trust scores backed by on-chain analysis.
          </p>

          {/* CTAs */}
          <div className="mb-16 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/scanner"
              className={cn(
                'inline-flex items-center gap-2 rounded-lg px-7 py-3 text-[14px] font-semibold',
                'bg-primary text-[#0B0F14] transition-all duration-200',
                'hover:bg-[#6EE7A0] hover:shadow-[0_0_24px_rgba(74,222,128,0.4)] hover:-translate-y-0.5',
              )}
            >
              Open Scanner
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://t.me/enigma_avax"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'inline-flex items-center gap-2 rounded-lg px-7 py-3 text-[14px] font-semibold',
                'border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] text-white',
                'hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.16)] transition-all duration-200',
              )}
            >
              <MessageCircle className="h-4 w-4" />
              Contact Us
            </a>
          </div>

          {/* Live agents preview card */}
          {stats.recentAgents.length > 0 && (
            <div className={cn(
              'mx-auto max-w-md overflow-hidden rounded-xl text-left',
              'border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)]',
              'backdrop-blur-[20px]',
            )}>
              <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] px-4 py-3">
                <div className="flex items-center gap-2">
                  <Activity className="h-3.5 w-3.5 text-primary" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                    Recent Agents
                  </span>
                </div>
                <span className="font-data text-[11px] text-[#475569]">live</span>
              </div>

              <div className="divide-y divide-[rgba(255,255,255,0.04)]">
                {stats.recentAgents.map((agent) => (
                  <Link
                    key={agent.address}
                    href={`/agents/${agent.address}`}
                    className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-[rgba(255,255,255,0.04)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md',
                        'bg-[rgba(74,222,128,0.1)] text-[10px] font-bold text-primary',
                      )}>
                        {agent.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="truncate text-[13px] font-medium text-white" style={{ maxWidth: 160 }}>
                          {agent.name}
                        </p>
                        <p className="text-[11px] text-[#475569]">
                          {agent.status === 'VERIFIED' ? (
                            <span className="flex items-center gap-1 text-primary">
                              <ShieldCheck className="h-3 w-3" /> Verified
                            </span>
                          ) : (
                            <span className="capitalize">{agent.status.toLowerCase()}</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <TrustBadge score={agent.trust_score} />
                  </Link>
                ))}
              </div>

              <div className="border-t border-[rgba(255,255,255,0.06)] px-4 py-2.5">
                <Link
                  href="/scanner/agents"
                  className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-[#64748B] hover:text-white transition-colors"
                >
                  View all {stats.total} agents
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          )}

          {stats.recentAgents.length === 0 && (
            <div className={cn(
              'mx-auto flex max-w-md items-center justify-center gap-3 rounded-xl py-8',
              'border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.02)]',
            )}>
              <Cpu className="h-5 w-5 text-[#334155]" />
              <span className="text-sm text-[#475569]">No agents indexed yet</span>
            </div>
          )}
        </div>
      </section>

      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />

      <section className="flex justify-center px-6 py-12">
        <VisitorStats />
      </section>

      <Footer />
    </>
  );
}
