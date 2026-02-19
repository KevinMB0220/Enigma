import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  xs: 'h-3 w-3 border',
  sm: 'h-4 w-4 border',
  md: 'h-5 w-5 border-2',
  lg: 'h-7 w-7 border-2',
};

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full',
        'border-[rgba(255,255,255,0.12)] border-t-primary',
        sizes[size],
        className,
      )}
    />
  );
}

export function SpinnerPage() {
  return (
    <div className="flex flex-1 items-center justify-center py-12">
      <Spinner size="lg" />
    </div>
  );
}
