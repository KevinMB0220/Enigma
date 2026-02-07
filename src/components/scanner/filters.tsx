'use client';

import { useState } from 'react';
import { ChevronDown, Filter, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils/index';

export interface FilterValues {
  type: string | undefined;
  status: string | undefined;
  minTrustScore: number;
}

interface FiltersProps {
  values: FilterValues;
  onChange: (filters: FilterValues) => void;
  className?: string;
}

const AGENT_TYPES = [
  { value: 'ALL', label: 'All Types' },
  { value: 'TRADING', label: 'Trading' },
  { value: 'LENDING', label: 'Lending' },
  { value: 'GOVERNANCE', label: 'Governance' },
  { value: 'ORACLE', label: 'Oracle' },
  { value: 'CUSTOM', label: 'Custom' },
];

const AGENT_STATUSES = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'VERIFIED', label: 'Verified' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'FLAGGED', label: 'Flagged' },
];

/**
 * Filters component for the Scanner page
 * Provides controls for filtering agents by type, status, and trust score
 */
export function Filters({ values, onChange, className }: FiltersProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleTypeChange = (value: string) => {
    onChange({
      ...values,
      type: value === 'ALL' ? undefined : value,
    });
  };

  const handleStatusChange = (value: string) => {
    onChange({
      ...values,
      status: value === 'ALL' ? undefined : value,
    });
  };

  const handleTrustScoreChange = (value: number[]) => {
    onChange({
      ...values,
      minTrustScore: value[0],
    });
  };

  const handleReset = () => {
    onChange({
      type: undefined,
      status: undefined,
      minTrustScore: 0,
    });
  };

  const hasActiveFilters =
    values.type !== undefined ||
    values.status !== undefined ||
    values.minTrustScore > 0;

  return (
    <div
      className={cn(
        'bg-[rgba(15,17,23,0.6)] backdrop-blur-[20px] rounded-lg border border-[rgba(255,255,255,0.06)]',
        className
      )}
    >
      {/* Header - Collapsible on mobile */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 md:cursor-default"
      >
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[rgba(255,255,255,0.6)]" />
          <span className="font-medium text-white">Filters</span>
          {hasActiveFilters && (
            <span className="px-2 py-0.5 text-xs bg-purple-500/20 text-purple-400 rounded-full">
              Active
            </span>
          )}
        </div>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-[rgba(255,255,255,0.4)] transition-transform md:hidden',
            isExpanded && 'rotate-180'
          )}
        />
      </button>

      {/* Filter Controls */}
      <div
        className={cn(
          'px-4 pb-4 space-y-4 transition-all',
          !isExpanded && 'hidden md:block'
        )}
      >
        {/* Type Filter */}
        <div className="space-y-2">
          <label className="text-sm text-[rgba(255,255,255,0.6)]">Type</label>
          <Select
            value={values.type || 'ALL'}
            onValueChange={handleTypeChange}
          >
            <SelectTrigger className="w-full bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              {AGENT_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <label className="text-sm text-[rgba(255,255,255,0.6)]">Status</label>
          <Select
            value={values.status || 'ALL'}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-full bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              {AGENT_STATUSES.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Trust Score Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm text-[rgba(255,255,255,0.6)]">
              Min Trust Score
            </label>
            <span className="text-sm font-medium text-white">
              {values.minTrustScore}
            </span>
          </div>
          <Slider
            value={[values.minTrustScore]}
            onValueChange={handleTrustScoreChange}
            max={100}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-[rgba(255,255,255,0.4)]">
            <span>0</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="w-full text-[rgba(255,255,255,0.6)] hover:text-white"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset Filters
          </Button>
        )}
      </div>
    </div>
  );
}
