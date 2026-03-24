'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Terminal, Cpu, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    <section ref={ref} className="relative z-10 mx-auto max-w-5xl px-6 py-40">
      <div
        className={cn(
          "relative overflow-hidden p-12 md:p-24 text-center border-2 border-flare-stroke bg-flare-surface/40 backdrop-blur-sm rounded-none transition-all duration-1000",
          isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-[0.98]"
        )}
      >
        {/* Decorative Technical Elements */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-flare-accent/30" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-flare-accent/30" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-flare-accent/30" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-flare-accent/30" />
        
        {/* Scanned Dot Pattern Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #4ADE80 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        
        {/* Technical Sidebars */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-8 opacity-20 hidden lg:flex">
          <Terminal size={14} className="text-flare-accent" />
          <Cpu size={14} className="text-flare-accent" />
          <Zap size={14} className="text-flare-accent" />
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-8 opacity-20 hidden lg:flex">
          <Zap size={14} className="text-flare-accent" />
          <Cpu size={14} className="text-flare-accent" />
          <Terminal size={14} className="text-flare-accent" />
        </div>

        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(circle at center, rgba(74,222,128,0.15) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-10 rounded-none border border-flare-accent/20 bg-flare-bg font-mono text-[10px] uppercase tracking-[0.4em] text-flare-accent font-black">
            <span className="w-1.5 h-1.5 bg-flare-accent animate-pulse" />
            Establish Secure Connection
          </div>
          
          <h2 className="mb-8 text-5xl md:text-7xl font-black text-flare-text-h tracking-tighter leading-none uppercase">
            Ready to <br className="hidden sm:block" />
            <span className="text-flare-accent">Launch Instance?</span>
          </h2>
          
          <p className="mx-auto mb-14 max-w-xl text-flare-text-l text-lg md:text-xl leading-relaxed font-medium">
            Join the autonomous network. Monitor, verify and scale your agents on the 
            most precise reputation layer built for Avalanche.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/scanner"
              className="group relative h-16 px-14 bg-flare-accent text-flare-bg font-black rounded-none flex items-center gap-3 transition-all hover:translate-y-[-4px] hover:shadow-[0_20px_50px_rgba(74,222,128,0.3)] duration-300"
            >
              <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform" />
              <span className="text-sm tracking-[0.2em] font-black uppercase">Initialize Scanner</span>
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-2" />
            </Link>
            
            <a
              href="/docs"
              className="h-16 px-12 border border-flare-stroke text-flare-text-h font-black rounded-none flex items-center gap-3 hover:border-flare-accent/40 transition-all group uppercase tracking-widest text-xs"
            >
              <span className="opacity-60 group-hover:opacity-100 transition-opacity">Technical Docs</span>
              <span className="text-flare-accent">/v1.0</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
