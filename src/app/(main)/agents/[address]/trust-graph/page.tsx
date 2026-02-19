'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import { useAgent } from '@/hooks/use-agent';
import { useAgentTrustHistory, type TrustHistoryPoint } from '@/hooks/use-agent-trust-history';
import { Spinner } from '@/components/shared/spinner';
import { cn } from '@/lib/utils/index';

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatFullDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function scoreDelta(points: TrustHistoryPoint[], index: number): string {
  if (index === 0) return '—';
  const delta = points[index].score - points[index - 1].score;
  if (delta === 0) return '—';
  return delta > 0 ? `+${delta}` : `${delta}`;
}

function deltaColor(points: TrustHistoryPoint[], index: number): string {
  if (index === 0) return 'text-[#475569]';
  const delta = points[index].score - points[index - 1].score;
  if (delta > 0) return 'text-[#4ADE80]';
  if (delta < 0) return 'text-[#FB7185]';
  return 'text-[#475569]';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const point: TrustHistoryPoint = payload[0].payload;
  return (
    <div className={cn(
      'rounded-lg border border-[rgba(255,255,255,0.08)] px-3 py-2',
      'bg-[rgba(11,15,20,0.95)] shadow-xl',
    )}>
      <p className="mb-1 text-[10px] text-[#475569]">{formatFullDate(point.date)}</p>
      <p className="font-data text-lg font-bold text-[#4ADE80]">{point.score}<span className="ml-0.5 text-xs font-normal text-[#475569]">/100</span></p>
    </div>
  );
}

export default function TrustGraphPage() {
  const { address } = useParams<{ address: string }>();
  const { data: agent, isLoading: agentLoading } = useAgent(address);
  const { data: history, isLoading: histLoading } = useAgentTrustHistory(address);

  const isLoading = agentLoading || histLoading;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Back nav */}
      <Link
        href={`/agents/${address}` as '/'}
        className="mb-6 inline-flex items-center gap-1.5 text-xs text-[#475569] transition-colors hover:text-white"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to {agent?.name ?? truncateAddress(address)}
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Trust Score History
        </h1>
        {agent && (
          <p className="mt-1 font-data text-sm text-[#475569]">
            {agent.name} · {truncateAddress(address)}
          </p>
        )}
      </div>

      {/* Chart card */}
      <div className={cn(
        'mb-6 rounded-xl border border-[rgba(255,255,255,0.06)] p-6',
        'bg-[rgba(255,255,255,0.02)]',
      )}>
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Spinner className="h-6 w-6" />
          </div>
        ) : !history?.length ? (
          <div className="flex h-64 flex-col items-center justify-center gap-2 text-center">
            <p className="text-sm font-medium text-white">No history yet</p>
            <p className="text-xs text-[#475569]">Trust score snapshots appear here after the indexer runs.</p>
          </div>
        ) : (
          <>
            {/* Score summary row */}
            <div className="mb-6 flex items-end gap-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#475569]">Current Score</p>
                <p className="font-data mt-1 text-4xl font-bold text-[#4ADE80]">
                  {history[history.length - 1].score}
                  <span className="ml-1 text-base font-normal text-[#475569]">/100</span>
                </p>
              </div>
              {history.length >= 2 && (() => {
                const delta = history[history.length - 1].score - history[0].score;
                return (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[#475569]">All-time change</p>
                    <p className={cn(
                      'font-data mt-1 text-lg font-semibold',
                      delta >= 0 ? 'text-[#4ADE80]' : 'text-[#FB7185]',
                    )}>
                      {delta >= 0 ? `+${delta}` : delta}
                    </p>
                  </div>
                );
              })()}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#475569]">Snapshots</p>
                <p className="font-data mt-1 text-lg font-semibold text-white">{history.length}</p>
              </div>
            </div>

            {/* Area chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                  <defs>
                    <linearGradient id="trustGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4ADE80" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#4ADE80" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.04)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDate}
                    tick={{ fill: '#475569', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: '#475569', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    width={32}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.08)', strokeWidth: 1 }} />
                  <ReferenceLine y={80} stroke="rgba(74,222,128,0.2)" strokeDasharray="4 4" label={{ value: 'High', fill: '#4ADE80', fontSize: 9 }} />
                  <ReferenceLine y={60} stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" label={{ value: 'Med', fill: '#475569', fontSize: 9 }} />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#4ADE80"
                    strokeWidth={2}
                    fill="url(#trustGradient)"
                    dot={false}
                    activeDot={{ r: 4, fill: '#4ADE80', stroke: '#0B0F14', strokeWidth: 2 }}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>

      {/* Snapshot table */}
      {history && history.length > 0 && (
        <div className={cn(
          'rounded-xl border border-[rgba(255,255,255,0.06)]',
          'bg-[rgba(255,255,255,0.02)]',
        )}>
          <div className="border-b border-[rgba(255,255,255,0.06)] px-5 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#475569]">Snapshot History</p>
          </div>
          <div className="divide-y divide-[rgba(255,255,255,0.04)]">
            {[...history].reverse().map((point, i, arr) => {
              const origIndex = history.length - 1 - i;
              return (
                <div key={point.date} className="flex items-center justify-between px-5 py-2.5">
                  <span className="font-data text-xs text-[#475569]">{formatFullDate(point.date)}</span>
                  <div className="flex items-center gap-4">
                    <span className={cn('font-data text-xs font-medium', deltaColor(history, origIndex))}>
                      {i === arr.length - 1 ? '—' : scoreDelta(history, origIndex)}
                    </span>
                    <span className="font-data text-sm font-bold text-white w-10 text-right">{point.score}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
