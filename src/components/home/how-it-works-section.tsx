'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const steps = [
  {
    step: '01',
    title: 'Discover Network',
    description:
      'Browse the Scanner to find autonomous agents published on Avalanche. Filter by type, status, or trust score.',
  },
  {
    step: '02',
    title: 'Verify Protocol',
    description:
      'Centinela analyzes each agent for proxy patterns, OpenZeppelin compliance, and uptime to generate a Trust Score.',
  },
  {
    step: '03',
    title: 'Monitor Uptime',
    description:
      'Track agent health over time with heartbeat monitoring, volume analysis, and community ratings from our verified nodes.',
  },
];

export function HowItWorksSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [stepsVisible, setStepsVisible] = useState(false);

  useEffect(() => {
    const header = headerRef.current;
    const stepsContainer = stepsRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === header && entry.isIntersecting) {
            setHeaderVisible(true);
          }
          if (entry.target === stepsContainer && entry.isIntersecting) {
            setStepsVisible(true);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (header) observer.observe(header);
    if (stepsContainer) observer.observe(stepsContainer);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" className="relative z-10 mx-auto max-w-4xl px-6 py-32 border-t border-flare-stroke">
      <div
        ref={headerRef}
        className={cn(
          "mb-24 text-center transition-all duration-700",
          headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}
      >
        <div className="inline-block px-3 py-1 mb-4 rounded-none border border-flare-stroke bg-flare-surface font-mono text-[9px] uppercase tracking-[0.25em] text-flare-accent">
          Workflow
        </div>
        <h2 className="mb-4 text-4xl font-bold text-flare-text-h lg:text-5xl tracking-tight">
          How It Works
        </h2>
        <p className="mx-auto max-w-2xl text-flare-text-l">
          Three precise stages to evaluate the trustworthiness of any autonomous agent. No complex settings.
        </p>
      </div>

      <div ref={stepsRef} className="space-y-4">
        {steps.map((item, index) => (
          <div 
            key={item.step}
            className={cn(
              "relative pl-20 pb-12 last:pb-0 transition-all duration-500",
              stepsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}
            style={{ transitionDelay: `${index * 150}ms` }}
          >
            {/* Vertical line */}
            {index < 2 && (
              <div className="absolute left-6 top-14 w-px h-[calc(100%-8px)] bg-flare-stroke" />
            )}
            
            {/* Step number button */}
            <div className="absolute left-0 top-0 w-12 h-12 rounded-none bg-flare-surface border border-flare-stroke flex items-center justify-center shadow-lg group-hover:border-flare-accent/30 transition-colors">
              <span className="font-mono text-sm font-bold text-flare-accent tracking-widest">{item.step}</span>
            </div>
            
            <h3 className="text-xl font-bold text-flare-text-h mb-3 uppercase tracking-wide">
              {item.title}
            </h3>
            <p className="text-flare-text-l leading-relaxed max-w-lg">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
