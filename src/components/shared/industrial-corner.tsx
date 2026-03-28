import { cn } from '@/lib/utils';

interface IndustrialCornerProps {
  position: 'tl' | 'tr' | 'bl' | 'br';
  className?: string;
  size?: number;
}

export function IndustrialCorner({ 
  position, 
  className,
  size = 4 
}: IndustrialCornerProps) {
  const classes = {
    tl: "top-0 left-0 border-t-2 border-l-2",
    tr: "top-0 right-0 border-t-2 border-r-2",
    bl: "bottom-0 left-0 border-b-2 border-l-2",
    br: "bottom-0 right-0 border-b-2 border-r-2",
  };
  
  return (
    <div 
      className={cn(
        "absolute border-[#059669]/40 transition-all duration-300 group-hover:border-[#4ADE80]/60", 
        classes[position],
        className
      )} 
      style={{ width: `${size * 4}px`, height: `${size * 4}px` }}
    />
  );
}
