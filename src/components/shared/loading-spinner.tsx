'use client';

import { cn } from '@/lib/utils/index';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

/**
 * Attractive loading spinner with orbital animation
 * Designed to match the Enigma design system
 */
export function LoadingSpinner({
  size = 'md',
  text = 'Loading...',
  className
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-16 w-16',
    lg: 'h-24 w-24',
  };

  const orbitSizes = {
    sm: { inner: 'h-6 w-6', outer: 'h-8 w-8' },
    md: { inner: 'h-12 w-12', outer: 'h-16 w-16' },
    lg: { inner: 'h-18 w-18', outer: 'h-24 w-24' },
  };

  const dotSizes = {
    sm: 'h-1.5 w-1.5',
    md: 'h-2 w-2',
    lg: 'h-3 w-3',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
      {/* Orbital spinner container */}
      <div className={cn('relative', sizeClasses[size])}>
        {/* Outer orbit ring */}
        <div
          className={cn(
            'absolute inset-0 rounded-full border-2 border-primary/20',
            orbitSizes[size].outer
          )}
        />

        {/* Inner orbit ring */}
        <div
          className={cn(
            'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/30',
            orbitSizes[size].inner
          )}
        />

        {/* Center core with pulse */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-primary animate-pulse"
          style={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.6)' }}
        />

        {/* Orbiting dot 1 - fast orbit */}
        <div
          className="absolute inset-0 animate-spin"
          style={{ animationDuration: '1.5s' }}
        >
          <div
            className={cn(
              'absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary',
              dotSizes[size]
            )}
            style={{ boxShadow: '0 0 10px rgba(59, 130, 246, 0.8)' }}
          />
        </div>

        {/* Orbiting dot 2 - medium orbit, counter-clockwise */}
        <div
          className="absolute inset-0"
          style={{
            animation: 'spin 2.5s linear infinite reverse',
          }}
        >
          <div
            className={cn(
              'absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rounded-full bg-[#8b5cf6]',
              dotSizes[size]
            )}
            style={{ boxShadow: '0 0 10px rgba(139, 92, 246, 0.8)' }}
          />
        </div>

        {/* Orbiting dot 3 - slow orbit */}
        <div
          className="absolute inset-0 animate-spin"
          style={{ animationDuration: '3s' }}
        >
          <div
            className={cn(
              'absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 rounded-full bg-[#06b6d4]',
              dotSizes[size]
            )}
            style={{ boxShadow: '0 0 10px rgba(6, 182, 212, 0.8)' }}
          />
        </div>

        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-full animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
            animationDuration: '2s'
          }}
        />
      </div>

      {/* Loading text */}
      {text && (
        <p className="text-sm text-text-secondary animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}
