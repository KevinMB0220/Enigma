'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2 } from 'lucide-react';
import { useAgents, type Agent } from '@/hooks/use-agents';
import { cn } from '@/lib/utils/index';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * Debounce hook
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Truncate address for display
 */
function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * SearchBar component with autocomplete
 * Provides search with debounced input and dropdown results
 */
export function SearchBar({ value, onChange, className }: SearchBarProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Debounce search input
  const debouncedSearch = useDebounce(value, 300);

  // Fetch agents for autocomplete
  const { data, isLoading } = useAgents({
    search: debouncedSearch,
    limit: 5,
  });

  const results = useMemo(() => data?.agents || [], [data?.agents]);
  const showDropdown = isFocused && value.length > 0 && results.length > 0;

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [results]);

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
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsFocused(false);
        break;
    }
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[rgba(255,255,255,0.4)]" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search by name or address..."
          className={cn(
            'w-full pl-10 pr-10 py-2.5 rounded-lg',
            'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)]',
            'text-white placeholder:text-[rgba(255,255,255,0.4)]',
            'focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50',
            'transition-all'
          )}
        />
        {/* Loading/Clear button */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isLoading && value.length > 0 ? (
            <Loader2 className="h-4 w-4 text-[rgba(255,255,255,0.4)] animate-spin" />
          ) : value.length > 0 ? (
            <button
              onClick={handleClear}
              className="p-0.5 rounded hover:bg-[rgba(255,255,255,0.1)] transition-colors"
            >
              <X className="h-4 w-4 text-[rgba(255,255,255,0.4)]" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Autocomplete Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 py-1 bg-[rgba(15,17,23,0.95)] backdrop-blur-lg rounded-lg border border-[rgba(255,255,255,0.1)] shadow-xl z-50">
          {results.map((agent, index) => (
            <button
              key={agent.address}
              onClick={() => handleSelect(agent)}
              className={cn(
                'w-full px-3 py-2 flex items-center gap-3 text-left',
                'hover:bg-[rgba(255,255,255,0.05)] transition-colors',
                selectedIndex === index && 'bg-[rgba(255,255,255,0.05)]'
              )}
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white truncate">
                  {agent.name}
                </div>
                <div className="text-xs text-[rgba(255,255,255,0.5)] font-mono">
                  {truncateAddress(agent.address)}
                </div>
              </div>
              <div
                className={cn(
                  'px-2 py-0.5 rounded text-xs font-medium',
                  agent.trust_score >= 70
                    ? 'bg-green-500/10 text-green-400'
                    : agent.trust_score >= 50
                    ? 'bg-yellow-500/10 text-yellow-400'
                    : 'bg-red-500/10 text-red-400'
                )}
              >
                {agent.trust_score}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
