'use client';

import { useEffect, useRef, useState } from 'react';
import { Shield, Eye, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: Shield,
    title: 'Trust Indicator',
    description:
      'Multi-factor scoring combining on-chain volume, proxy detection, uptime monitoring, and OpenZeppelin compliance.',
  },
  {
    icon: Eye,
    title: 'Centinela Node',
    description:
      'Automated verification engine that monitors heartbeat, detects proxy patterns, and matches implementation against known OASF standards.',
  },
  {
    icon: Zap,
    title: 'Live Telemetry',
    description:
      'Continuous uptime tracking and volume analysis ensure you have real-time data on agent health and network status.',
  },
];

export function FeaturesSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);

  useEffect(() => {
    const header = headerRef.current;
    const cards = cardsRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === header && entry.isIntersecting) {
            setHeaderVisible(true);
          }
          if (entry.target === cards && entry.isIntersecting) {
            setCardsVisible(true);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (header) observer.observe(header);
    if (cards) observer.observe(cards);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" className="relative z-10 mx-auto max-w-6xl px-6 py-32 border-t border-flare-stroke">
      <div
        ref={headerRef}
        className={cn(
          "mb-20 text-center transition-all duration-700",
          headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}
      >
        <div className="inline-block px-3 py-1 mb-4 rounded-none border border-flare-stroke bg-flare-surface font-mono text-[9px] uppercase tracking-[0.25em] text-flare-accent">
          Core Logic
        </div>
        <h2 className="mb-4 text-4xl font-bold text-flare-text-h lg:text-5xl tracking-tight">
          Why Enigma?
        </h2>
        <p className="mx-auto max-w-2xl text-flare-text-l text-balance">
          A high-precision infrastructure for evaluating and monitoring autonomous agents on Avalanche network.
        </p>
      </div>

      <div ref={cardsRef} className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className={cn(
              "p-8 border border-flare-stroke bg-flare-surface rounded-none transition-all duration-500 hover:border-flare-accent/30 hover:translate-y-[-4px] group",
              cardsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}
            style={{ transitionDelay: `${index * 150}ms` }}
          >
            <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-none border border-flare-stroke bg-flare-bg transition-colors group-hover:border-flare-accent/30 group-hover:bg-flare-accent/5">
              <feature.icon className="h-5 w-5 text-flare-accent" />
            </div>
            <h3 className="mb-3 text-[16px] font-bold text-flare-text-h uppercase tracking-wide">{feature.title}</h3>
            <p className="text-sm leading-relaxed text-flare-text-l">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
