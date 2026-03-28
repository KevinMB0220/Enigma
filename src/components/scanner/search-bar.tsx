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
    router.push('/scanner');
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
          isFocused ? "text-[#4ADE80]" : "text-[#475569]/60"
        )} />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="SEARCH_REGISTRY_v1.0..."
          className={cn(
            'w-full pl-12 pr-12 py-3.5 rounded-none transition-all duration-300 font-mono text-[11px] font-black uppercase tracking-[0.2em] relative z-10',
            'bg-[#080B10]/80 border border-[#4ADE80]/10 text-white placeholder:text-[#4ADE80]/20',
            'focus:outline-none focus:ring-0 focus:border-[#4ADE80]/40 focus:bg-[#4ADE80]/[0.02]',
            isFocused && "shadow-[0_0_30px_rgba(74,222,128,0.1)] border-[#4ADE80]/50"
          )}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 z-20">
          {isLoading && value.length > 0 && <Loader2 className="h-4 w-4 text-[#4ADE80] animate-spin" />}
          {value.length > 0 && (
            <button onClick={handleClear} className="p-1 text-[#4ADE80]/40 hover:text-[#4ADE80] transition-colors">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {typeof document !== 'undefined' && showDropdown && dropdownRect &&
        createPortal(
          <div
            ref={dropdownRef}
            className="rounded-none border-l-2 border-[#4ADE80] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.9)] ring-1 ring-[#4ADE80]/20"
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
                  'w-full px-6 py-5 flex items-center justify-between gap-8 text-left border-b border-[#4ADE80]/5 last:border-0 relative group/item transition-all duration-300',
                  (selectedIndex === index) ? 'bg-[#4ADE80]/[0.05]' : 'bg-transparent',
                  'hover:bg-[#4ADE80]/[0.08]'
                )}
              >
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#4ADE80] scale-y-0 group-hover/item:scale-y-100 transition-all duration-300 origin-top z-10" />
                
                <div className="flex-1 min-w-0">
                  <div className="font-black text-[13px] text-white uppercase tracking-tight truncate group-hover/item:text-[#4ADE80] transition-colors">
                    {agent.name}
                  </div>
                  <div className="text-[9px] text-[#475569] font-mono uppercase tracking-widest opacity-30 mt-1">
                    {truncateAddress(agent.address)}
                  </div>
                </div>
                <div className={cn(
                  'px-4 py-1.5 font-mono text-[11px] font-black rounded-none border transition-all',
                  agent.trust_score >= 80 ? 'text-[#4ADE80] border-[#4ADE80]/20 bg-[#4ADE80]/5' :
                  agent.trust_score >= 60 ? 'text-[#10B981] border-[#10B981]/20 bg-[#10B981]/5' :
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
