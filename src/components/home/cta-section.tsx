'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative z-10 mx-auto max-w-4xl px-6 py-20">
      <div
        className={`glass overflow-hidden p-12 text-center interactive-card hover-glow ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}
      >
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
  );
}
