'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2 } from 'lucide-react';
import { useAgents, type Agent } from '@/hooks/use-agents';
import { cn } from '@/lib/utils/index';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => { setDebouncedValue(value); }, delay);
    return () => { clearTimeout(timer); };
  }, [value, delay]);
  return debouncedValue;
}

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function SearchBar({ value, onChange, className }: SearchBarProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [dropdownRect, setDropdownRect] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const debouncedSearch = useDebounce(value, 300);
  const { data, isLoading } = useAgents({
    search: debouncedSearch,
    limit: 5,
  });

  const results = useMemo(() => data?.agents || [], [data?.agents]);
  const showDropdown = isFocused && value.length > 0 && results.length > 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!containerRef.current?.contains(target) && !dropdownRef.current?.contains(target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => { setSelectedIndex(-1); }, [results]);

  const updateDropdownRect = () => {
    if (containerRef.current && showDropdown) {
      const rect = containerRef.current.getBoundingClientRect();
      setDropdownRect({
        top: rect.bottom + 1,
        left: rect.left,
        width: rect.width,
      });
    } else {
      setDropdownRect(null);
    }
  };

  useEffect(() => {
    if (!showDropdown) { setDropdownRect(null); return; }
    updateDropdownRect();
    window.addEventListener('scroll', updateDropdownRect, true);
    window.addEventListener('resize', updateDropdownRect);
    return () => {
      window.removeEventListener('scroll', updateDropdownRect, true);
      window.removeEventListener('resize', updateDropdownRect);
    };
  }, [showDropdown, results]);

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  const handleSelect = (agent: Agent) => {
    onChange('');
    setIsFocused(false);
    router.push(`/agents/${agent.address}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => prev < results.length - 1 ? prev + 1 : prev);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) { handleSelect(results[selectedIndex]); }
        break;
      case 'Escape':
        setIsFocused(false);
        break;
    }
  };

  return (
    <div ref={containerRef} className={cn('relative group', className)}>
      <div className="relative">
        <Search className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-300",
          isFocused ? "text-flare-accent" : "text-flare-text-l opacity-30"
        )} />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Registry search_v1.0..."
          className={cn(
            'w-full pl-12 pr-12 py-3.5 rounded-none transition-all duration-300',
            'bg-[#05070A]/80 border border-transparent font-mono text-[11px] font-bold uppercase tracking-[0.2em] relative z-10',
            'text-flare-text-h placeholder:text-flare-text-l placeholder:opacity-40',
            'focus:outline-none focus:bg-flare-accent/[0.03] ring-1 ring-inset ring-white/[0.05]',
            isFocused && "shadow-[0_0_30px_rgba(0,0,0,0.5)] ring-flare-accent/30"
          )}
        />
        {/* Invisible default border cleaner */}
        <div className="absolute inset-0 border border-transparent ring-1 ring-inset ring-white/[0.03] pointer-events-none" />

        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 z-20">
          {isLoading && value.length > 0 && <Loader2 className="h-4 w-4 text-flare-accent animate-spin" />}
          {value.length > 0 && (
            <button onClick={handleClear} className="p-1 text-flare-text-l hover:text-flare-accent transition-colors">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {typeof document !== 'undefined' && showDropdown && dropdownRect &&
        createPortal(
          <div
            ref={dropdownRef}
            className="rounded-none border border-transparent ring-1 ring-inset ring-white/[0.05] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.9)]"
            style={{
              position: 'fixed',
              top: dropdownRect.top,
              left: dropdownRect.left,
              width: dropdownRect.width,
              zIndex: 9999,
              backgroundColor: '#0F1219',
              pointerEvents: 'auto',
            }}
          >
            {results.map((agent, index) => (
              <button
                key={agent.address}
                type="button"
                onClick={() => handleSelect(agent)}
                className={cn(
                  'w-full px-6 py-5 flex items-center justify-between gap-8 text-left border-b border-white/[0.03] last:border-0 relative group/item transition-all duration-300',
                  (selectedIndex === index) ? 'bg-flare-accent/[0.05]' : 'bg-transparent',
                  'hover:bg-flare-accent/[0.08]'
                )}
              >
                <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-flare-accent scale-y-0 group-hover/item:scale-y-100 transition-all duration-300 origin-top z-10" />
                
                <div className="flex-1 min-w-0">
                  <div className="font-black text-[14px] text-flare-text-h uppercase tracking-tight truncate group-hover/item:text-flare-accent transition-colors">
                    {agent.name}
                  </div>
                  <div className="text-[10px] text-flare-text-l font-mono uppercase tracking-widest opacity-30 mt-1">
                    {truncateAddress(agent.address)}
                  </div>
                </div>
                <div className={cn(
                  'px-4 py-1.5 font-mono text-[12px] font-black rounded-none border transition-all',
                  agent.trust_score >= 80 ? 'text-flare-accent border-flare-accent/20 bg-flare-accent/5' :
                  agent.trust_score >= 60 ? 'text-[#22D3EE] border-[#22D3EE]/20 bg-[#22D3EE]/05' :
                  'text-[#FB7185] border-[#FB7185]/20 bg-[#FB7185]/05'
                )}>
                  {agent.trust_score}.0
                </div>
              </button>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}
