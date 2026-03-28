'use client';

import { RotateCcw } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils/index';

export interface FilterValues {
  service: string | undefined;
  status: string | undefined;
  trustScoreRange: [number, number];
  sortBy?: 'trust_score' | 'created_at' | 'name';
  sortOrder?: 'asc' | 'desc';
}

interface FiltersProps {
  values: FilterValues;
  onChange: (filters: FilterValues) => void;
}

const SERVICES = [
  { value: 'MCP',  label: 'MCP',  activeClass: 'bg-[#4ADE80]/10 text-[#4ADE80] border-[#4ADE80]' },
  { value: 'A2A',  label: 'A2A',  activeClass: 'bg-[#FCD34D]/10 text-[#FCD34D] border-[#FCD34D]' },
  { value: 'web',  label: 'WEB',  activeClass: 'bg-[#22D3EE]/10 text-[#22D3EE] border-[#22D3EE]' },
  { value: 'OASF', label: 'OASF', activeClass: 'bg-[#A78BFA]/10 text-[#A78BFA] border-[#A78BFA]' },
];

const STATUSES = [
  { value: 'ALL',       label: 'All protocols' },
  { value: 'VERIFIED',  label: 'Verified only' },
  { value: 'PENDING',   label: 'Pending sync'  },
  { value: 'FLAGGED',   label: 'Flagged'        },
  { value: 'SUSPENDED', label: 'Suspended node' },
];

const SORT_FIELDS = [
  { value: 'trust_score', label: 'Trust Score'  },
  { value: 'created_at',  label: 'Sync Time'    },
  { value: 'name',        label: 'Name'         },
];

const SORT_ORDERS = [
  { value: 'desc', label: 'Descending' },
  { value: 'asc',  label: 'Ascending'  },
];

function SectionLabel({ label }: { label: string }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-flare-text-l mb-3">
      {label}
    </p>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <SectionLabel label={label} />
      <div className="flex flex-col gap-1">
        {options.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={cn(
                'w-full text-left px-4 py-2 text-[11px] font-semibold tracking-wide transition-all duration-150 rounded-sm relative',
                active
                  ? 'bg-[#4ADE80]/10 text-[#4ADE80]'
                  : 'text-flare-text-l hover:bg-[#1e2130] hover:text-flare-text-h'
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-[#4ADE80] rounded-r-sm" />
              )}
              <span className="pl-1">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Filters({ values, onChange }: FiltersProps) {
  const hasActive =
    !!values.service ||
    !!values.status ||
    values.trustScoreRange[0] > 0 ||
    values.trustScoreRange[1] < 100 ||
    !!values.sortBy;

  const set = (patch: Partial<FilterValues>) => onChange({ ...values, ...patch });

  return (
    <div className="flex flex-col gap-8">

      {/* Access Layer */}
      <div>
        <SectionLabel label="Access Layer" />
        <div className="grid grid-cols-2 gap-2">
          {SERVICES.map((svc) => {
            const active = values.service === svc.value;
            return (
              <button
                key={svc.value}
                onClick={() => set({ service: active ? undefined : svc.value })}
                className={cn(
                  'border px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition-all duration-150 rounded-sm',
                  active
                    ? svc.activeClass
                    : 'border-[#2a2d3a] bg-[#1a1b23] text-flare-text-l hover:border-[#4ADE80]/40 hover:text-[#4ADE80]'
                )}
              >
                {svc.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Status */}
      <FilterSelect
        label="Validation Protocol"
        value={values.status ?? 'ALL'}
        options={STATUSES}
        onChange={(v) => set({ status: v === 'ALL' ? undefined : v })}
      />

      {/* Sort by */}
      <FilterSelect
        label="Ordering Logic"
        value={values.sortBy ?? 'trust_score'}
        options={SORT_FIELDS}
        onChange={(v) => set({ sortBy: v as FilterValues['sortBy'] })}
      />

      {/* Sort order */}
      <FilterSelect
        label="Sequence Direction"
        value={values.sortOrder ?? 'desc'}
        options={SORT_ORDERS}
        onChange={(v) => set({ sortOrder: v as 'asc' | 'desc' })}
      />

      {/* Trust score range */}
      <div className="space-y-4 pt-6 border-t border-[#2a2d3a]">
        <div className="flex items-center justify-between">
          <SectionLabel label="Trust Horizon" />
          <span className="font-mono text-[12px] font-bold text-[#4ADE80]">
            {values.trustScoreRange[0]}–{values.trustScoreRange[1]}
          </span>
        </div>
        <Slider
          value={values.trustScoreRange}
          onValueChange={(v) => set({ trustScoreRange: [v[0], v[1]] })}
          min={0}
          max={100}
          step={1}
          minStepsBetweenThumbs={1}
          className="w-full [&_[role=slider]]:bg-[#4ADE80] [&_[role=slider]]:h-3 [&_[role=slider]]:w-2 [&_[role=slider]]:rounded-sm [&_[role=track]]:bg-[#1e2130] ring-0"
        />
      </div>

      {/* Reset */}
      {hasActive && (
        <button
          onClick={() => onChange({ service: undefined, status: undefined, trustScoreRange: [0, 100], sortBy: undefined, sortOrder: undefined })}
          className="flex w-full items-center justify-center gap-2 py-3 text-[11px] font-bold uppercase tracking-widest transition-all rounded-sm border border-[#2a2d3a] hover:border-[#4ADE80]/60 hover:bg-[#4ADE80]/5 text-flare-text-l hover:text-[#4ADE80]"
        >
          <RotateCcw className="h-3 w-3" />
          Reset Filters
        </button>
      )}
    </div>
  );
}
