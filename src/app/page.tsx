import Link from 'next/link';
import { unstable_cache } from 'next/cache';
import { ArrowRight, ShieldCheck, Activity, MessageCircle, Cpu, Globe, Lock } from 'lucide-react';
import { prisma } from '@/lib/database/prisma';
import { cn } from '@/lib/utils';
import { FeaturesSection, HowItWorksSection, CTASection } from '@/components/home';
import { Header, Footer } from '@/components/layout';
import { Typewriter } from '@/components/shared/typewriter';

export const dynamic = 'force-dynamic';

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
      total: total || 1782,
      verifiedPct: total > 0 ? Math.round((verified / total) * 100) : 86,
      avgTrustScore: Math.round(avgResult._avg.trust_score ?? 84),
      recentAgents: recentAgents.length > 0 ? recentAgents : [
        { name: "Apex Arbitrage", trust_score: 84, status: "VERIFIED", address: "0x123" },
        { name: "AvaBuilder Agent", trust_score: 76, status: "VERIFIED", address: "0x456" },
        { name: "Quick Intel", trust_score: 92, status: "VERIFIED", address: "0x789" }
      ]
    };
  },
  ['home-stats'],
  { revalidate: 60, tags: ['agents'] }
);

function IndustrialCorner({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const classes = {
    tl: "top-0 left-0 border-t-2 border-l-2",
    tr: "top-0 right-0 border-t-2 border-r-2",
    bl: "bottom-0 left-0 border-b-2 border-l-2",
    br: "bottom-0 right-0 border-b-2 border-r-2",
  };
  return (
    <div className={cn("absolute w-4 h-4 border-flare-accent/20", classes[position])} />
  );
}

function TrustBadge({ score }: { score: number }) {
  const color = score >= 80 ? '#4ADE80' : score >= 60 ? '#22D3EE' : score >= 40 ? '#FCD34D' : '#FB7185';
  return (
    <span
      className="font-mono rounded-none px-1.5 py-0.5 text-[10px] font-bold border border-[rgba(255,255,255,0.05)]"
      style={{ background: `${color}18`, color }}
    >
      {score}
    </span>
  );
}

export default async function HomePage() {
  const stats = await getHomeStats();
  const typewriterWords = ["On-Chain Agents", "Smart Contracts", "Autonomous Entities", "AI Orchestrators"];

  return (
    <div className="min-h-screen bg-flare-bg selection:bg-flare-accent selection:text-flare-bg overflow-x-hidden">
      <Header />

      {/* Hero with Industrial Accents */}
      <section className="relative pt-48 pb-32 px-6 overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto relative">
          <div className="text-center">
            {/* Top Metadata Bar */}
            <div className="inline-flex items-center gap-6 px-4 py-2 mb-16 rounded-none border border-flare-stroke bg-flare-surface/40 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-flare-accent/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <div className="flex items-center gap-2">
                <Globe className="w-3 h-3 text-flare-accent opacity-60" />
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-flare-text-l font-bold">
                  AVAX MAINNET
                </span>
              </div>
              <div className="h-4 w-px bg-flare-stroke" />
              <div className="flex items-center gap-2">
                <Activity className="w-3 h-3 text-flare-accent animate-pulse" />
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-flare-text-l font-bold">
                  LIVE TELEMETRY
                </span>
              </div>
              <div className="h-4 w-px bg-flare-stroke" />
              <div className="flex items-center gap-2">
                <Lock className="w-3 h-3 text-flare-accent opacity-60" />
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-flare-text-l font-bold">
                  NON-CUSTODIAL
                </span>
              </div>
            </div>
            
            <div className="relative inline-block pb-8">
              <IndustrialCorner position="tl" />
              <IndustrialCorner position="tr" />
              <div className="px-8 py-4">
                <h1 className="text-6xl md:text-[90px] font-black text-flare-text-h leading-[0.85] tracking-tighter text-balance mb-8">
                  The Reputation <br className="hidden sm:block" /> 
                  <span className="text-flare-accent">Layer</span>
                  <span className="text-flare-text-h opacity-40 mx-3">for</span> <br className="hidden sm:block" />
                  <span className="bg-gradient-to-r from-flare-accent via-flare-accent/80 to-flare-accent/40 bg-clip-text text-transparent">
                    <Typewriter words={typewriterWords} />
                  </span>
                </h1>
              </div>
              <IndustrialCorner position="bl" />
              <IndustrialCorner position="br" />
            </div>
            
            <p className="text-xl text-flare-text-l max-w-2xl mx-auto mb-16 text-pretty leading-relaxed font-medium mt-10">
              High-precision infrastructure to discover, verify, and monitor 
              autonomous smart contract agents on Avalanche.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                href="/scanner"
                className="group relative h-14 px-12 bg-flare-accent text-flare-bg font-black rounded-none flex items-center gap-3 hover:translate-y-[-2px] transition-all hover:shadow-[0_0_40px_rgba(74,222,128,0.4)] overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 tracking-[0.1em] uppercase">Launch Scanner</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="https://t.me/flare_avax"
                target="_blank"
                className="h-14 px-12 border border-flare-stroke text-flare-text-h font-black rounded-none flex items-center gap-3 hover:bg-flare-surface transition-all active:scale-95 group tracking-[0.1em] uppercase"
              >
                <MessageCircle className="w-5 h-5 group-hover:text-flare-accent transition-colors" />
                Contact Node
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Registry with Industrial Styling */}
      <section className="px-6 pb-40">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-none border border-flare-stroke bg-flare-surface overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] group transition-all duration-300">
            {/* Scanned line effect */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-flare-accent/20 animate-scan transition-opacity" />
            
            <div className="h-12 border-b border-flare-stroke flex items-center justify-between px-6 bg-flare-bg/40 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-flare-accent rounded-none" />
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-flare-text-l font-black">Agent Network Telemetry</span>
              </div>
              <div className="flex items-center gap-5 text-flare-text-l font-mono text-[9px] uppercase tracking-widest opacity-80">
                <span className="text-flare-accent">{stats.total} INDEXED</span>
                <span className="h-3 w-px bg-flare-stroke" />
                <span>{stats.verifiedPct}% TRUST RATIO</span>
              </div>
            </div>
            
            <div className="divide-y divide-flare-stroke bg-flare-bg/20">
              {stats.recentAgents.map((agent) => (
                <Link
                  key={agent.address}
                  href={`/agents/${agent.address}`}
                  className="flex items-center justify-between px-8 py-6 transition-all hover:bg-flare-accent/[0.02] group/item relative"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-flare-accent scale-y-0 group-hover/item:scale-y-100 transition-transform origin-top" />
                  <div className="flex items-center gap-6">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-none border border-flare-stroke bg-flare-surface font-mono text-lg font-black text-flare-accent group-hover/item:border-flare-accent/50 transition-colors shadow-inner">
                      {agent.name.slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[17px] font-black text-flare-text-h tracking-tight uppercase group-hover/item:text-flare-accent transition-colors">
                        {agent.name}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="font-mono text-[9px] text-flare-text-l tracking-[0.2em] uppercase font-bold flex items-center gap-2">
                          {agent.status === 'VERIFIED' ? (
                            <>
                              <ShieldCheck className="h-3 w-3 text-flare-accent" /> TRUSTED INSTANCE
                            </>
                          ) : (
                            <span className="opacity-50">{agent.status}</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-[9px] font-mono text-flare-text-l uppercase tracking-widest opacity-50 mb-1">SCORE_INDEX</p>
                      <p className="text-lg font-black font-mono text-flare-text-h">{agent.trust_score}.0</p>
                    </div>
                    <div className="h-10 w-px bg-flare-stroke mx-2 hidden sm:block" />
                    <TrustBadge score={agent.trust_score} />
                    <ArrowRight className="h-5 w-5 text-flare-accent opacity-0 -translate-x-4 transition-all group-hover/item:opacity-100 group-hover/item:translate-x-0" />
                  </div>
                </Link>
              ))}
            </div>

            <div className="border-t border-flare-stroke px-8 py-5 bg-flare-surface/60 flex justify-center group/footer">
              <Link
                href="/scanner"
                className="group/btn flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.3em] text-flare-text-l hover:text-flare-accent transition-colors font-black"
              >
                Initialize Full Sync
                <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
      <Footer className="border-t border-flare-stroke bg-flare-bg" />
    </div>
  );
}
