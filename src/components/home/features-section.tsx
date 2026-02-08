'use client';

import { useEffect, useRef, useState } from 'react';
import { Shield, Eye, Zap } from 'lucide-react';

const features = [
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
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    );

    if (header) observer.observe(header);
    if (cards) observer.observe(cards);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative z-10 mx-auto max-w-6xl px-6 py-20">
      <div
        ref={headerRef}
        className={`mb-16 text-center ${headerVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
      >
        <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
          Why Enigma?
        </h2>
        <p className="mx-auto max-w-2xl text-text-secondary">
          A comprehensive platform for evaluating and monitoring autonomous agents on Avalanche.
        </p>
      </div>

      <div ref={cardsRef} className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className={`glass group p-8 interactive-card gradient-border ${cardsVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
            style={{ animationDelay: cardsVisible ? `${index * 150}ms` : '0ms' }}
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
  );
}
