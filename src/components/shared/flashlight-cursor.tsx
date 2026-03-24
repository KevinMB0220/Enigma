'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function FlashlightCursor() {
  const [mousePos, setMousePos] = useState({ x: -2000, y: -2000 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  if (isMobile) return null;

  return (
    <>
      {/* 
          Main Matrix Grid:
          - Full screen, perfectly aligned.
          - Invisible by default (opacity 0).
          - Revealed via radial mask at cursor.
      */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]"
        style={{
          maskImage: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 60%)`,
          WebkitMaskImage: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 60%)`,
        }}
      />

      {/* 
          Tenuous Ambient Glow:
          - Provides the "Flashlight" reveal feel.
      */}
      <div 
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, rgba(74, 222, 128, 0.03) 0%, transparent 70%)`,
        }}
      />

      {/* 
          Precise Cursor Dot Light:
          - Ultra-subtle (tenue) central glow.
      */}
      <div 
        className="pointer-events-none fixed left-0 top-0 z-[2] h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.05] blur-[80px]"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          background: 'radial-gradient(circle, rgba(74, 222, 128, 0.4) 0%, transparent 70%)',
        }}
      />
    </>
  );
}
