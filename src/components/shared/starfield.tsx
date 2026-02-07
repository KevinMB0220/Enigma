'use client';

import { useState, useEffect } from 'react';

const STAR_COUNT = 150;

interface Star {
  id: number;
  left: string;
  top: string;
  size: number;
  animationDuration: string;
  animationDelay: string;
}

export function Starfield() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    setStars(
      Array.from({ length: STAR_COUNT }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: Math.random() > 0.8 ? 3 : 2,
        animationDuration: `${Math.random() * 2 + 2}s`,
        animationDelay: `${Math.random() * 3}s`,
      }))
    );
  }, []);

  if (stars.length === 0) return null;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            animationDuration: star.animationDuration,
            animationDelay: star.animationDelay,
          }}
        />
      ))}
    </div>
  );
}
