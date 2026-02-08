'use client';

import { useEffect, useRef, useState } from 'react';

const steps = [
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
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    );

    if (header) observer.observe(header);
    if (stepsContainer) observer.observe(stepsContainer);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative z-10 mx-auto max-w-6xl px-6 py-20">
      <div
        ref={headerRef}
        className={`mb-16 text-center ${headerVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
      >
        <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
          How It Works
        </h2>
        <p className="mx-auto max-w-2xl text-text-secondary">
          Three simple steps to evaluate the trustworthiness of any autonomous agent.
        </p>
      </div>

      <div ref={stepsRef} className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {steps.map((item, index) => (
          <div
            key={item.step}
            className={`relative text-center group hover-lift p-6 ${stepsVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
            style={{ animationDelay: stepsVisible ? `${index * 150}ms` : '0ms' }}
          >
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
  );
}
