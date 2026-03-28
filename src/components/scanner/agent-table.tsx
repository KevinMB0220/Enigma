'use client';

import { useRouter } from 'next/navigation';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import { Clock, Shield, ShieldAlert, ShieldCheck, ShieldX } from 'lucide-react';
import { useState } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { type Agent } from '@/hooks/use-agents';
import { cn } from '@/lib/utils/index';

interface AgentTableProps {
  agents: Agent[];
  onSortChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

function getTrustScoreLineColor(score: number): string {
  if (score >= 80) return '#4ADE80';
  if (score >= 60) return '#FCD34D';
  if (score >= 40) return '#FCD34D';
  return '#FB7185';
}

function getStatusConfig(status: string) {
  const configs = {
    VERIFIED:  { icon: ShieldCheck, className: 'text-[#4ADE80] border-[#4ADE80]' },
    PENDING:   { icon: Clock,       className: 'text-[#FCD34D] border-[#FCD34D]' },
    FLAGGED:   { icon: ShieldAlert, className: 'text-[#FB7185] border-[#FB7185]' },
    SUSPENDED: { icon: ShieldX,     className: 'text-[#FB7185] opacity-50 border-[#FB7185]' },
  };
  return configs[status as keyof typeof configs] || {
    icon: Shield,
    className: 'text-flare-text-l border-flare-stroke/20',
  };
}

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatTimeAgo(dateString: string) {
  if (!dateString) return '30m ago';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}

function generateTwitterShareUrl(agent: Agent) {
  const isVerified = agent.status === 'VERIFIED';
  const statusEmoji = isVerified ? '🛡️' : '⏳';
  const typeStr = agent.type ? agent.type.toUpperCase() : 'CUSTOM';
  const url = `https://www.erc-8004scan.xyz/agents/${agent.address}`;
  
  // Example Target string:
  // 🕵️ AvaBuilder Agent — Trust Score: 46/100
  // 🛡️ VERIFIED | CUSTOM
  // Verified on FLARE • Avalanche https://...
  const text = `🕵️ ${agent.name} — Trust Score: ${agent.trust_score}/100\n${statusEmoji} ${agent.status} | ${typeStr}\n\nVerified on FLARE • Avalanche ${url}`;
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
}

function MiniSparkline({ address, score }: { address: string; score: number }) {
  const seed = address.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const data = Array.from({ length: 8 }, (_, i) => {
    const v = ((seed * (i + 1) * 7919) % 21) - 10;
    return { v: Math.max(0, Math.min(100, score + v)) };
  });
  const color = getTrustScoreLineColor(score);
  return (
    <div className="h-4 w-16 transition-opacity">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line type="stepAfter" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

const SortIcon = ({ active }: { active?: boolean }) => (
  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className={cn("ml-2 transition-colors", active ? "text-flare-accent" : "opacity-20")}>
    <path d="M7 15l5 5 5-5M7 9l5-5 5 5" />
  </svg>
);

const columns: ColumnDef<Agent>[] = [
  {
    id: 'index',
    header: () => <span className="text-[10px] font-black uppercase tracking-[0.4em] text-flare-text-l">#</span>,
    cell: ({ row }) => <span className="text-[11px] font-mono text-flare-text-l">{row.index + 1}</span>,
    size: 60,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="h-auto p-0 text-[10px] font-black uppercase tracking-[0.4em] text-flare-text-l hover:bg-transparent hover:text-flare-accent transition-colors">
        NAME
        <SortIcon active={column.getIsSorted() !== false} />
      </Button>
    ),
    cell: ({ row }) => {
      const image = row.original.metadata?.image;
      return (
        <div className="flex items-center gap-4 py-1">
          <div className="relative h-10 w-10 shrink-0 bg-[#05070A] border border-[#059669]/20 group-hover/row:border-[#4ADE80]/40 transition-all rounded-md overflow-hidden">
            {image ? ( <img src={image} alt={row.original.name} className="h-full w-full object-cover" /> ) : (
               <div className="h-full w-full flex items-center justify-center text-sm font-black text-flare-text-l bg-[#1a1b23]">
                 {row.original.name.slice(0, 2).toUpperCase()}
               </div>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[13px] font-bold text-flare-text-h tracking-wide truncate group-hover/row:text-flare-accent transition-colors">
              {row.original.name}
            </span>
            <span className="font-mono text-[10px] text-flare-text-l opacity-60">
              {truncateAddress(row.original.address)}
            </span>
          </div>
        </div>
      );
    },
    size: 300,
  },
  {
    accessorKey: 'type',
    header: () => <span className="text-[10px] font-black uppercase tracking-[0.4em] text-flare-text-l">TYPE</span>,
    cell: ({ row }) => {
      let types = row.original.services || [];
      if (types.length === 0) {
        types = [row.original.type];
      }
      
      const colors = [
        "border-[#22D3EE] text-[#22D3EE]",
        "border-[#FCD34D] text-[#FCD34D]",
        "border-[#4ADE80] text-[#4ADE80]",
        "border-[#A78BFA] text-[#A78BFA]",
        "border-[#64748B] text-[#64748B]"
      ];
      
      const visible = types.slice(0, 2);
      const overflow = types.length - 2;
      
      return (
        <div className="flex gap-1.5 items-center flex-wrap">
          {visible.map((t, idx) => (
            <Badge key={`${t}-${idx}`} variant="outline" className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider bg-[#1a1b23]", colors[idx % colors.length])}>
              {t}
            </Badge>
          ))}
          {overflow > 0 && (
            <span className="text-[9px] font-mono text-flare-text-l opacity-50">+{overflow}</span>
          )}
        </div>
      );
    },
    size: 200,
  },
  {
    accessorKey: 'trust_score',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="h-auto p-0 text-[10px] font-black uppercase tracking-[0.4em] text-flare-text-l hover:bg-transparent hover:text-flare-accent transition-colors">
        SCORE
        <SortIcon active={column.getIsSorted() !== false} />
      </Button>
    ),
    cell: ({ row }) => {
      const score = row.original.trust_score;
      const scoreColor = score >= 80 ? "text-[#4ADE80] bg-[#4ADE80]/10" : score >= 40 ? "text-[#FCD34D] bg-[#FCD34D]/10" : "text-[#FB7185] bg-[#FB7185]/10";
      return (
        <div className={cn(
          'inline-flex items-center justify-center font-mono px-2 py-1 text-[12px] font-bold rounded-md transition-all',
          scoreColor
        )}>
          {score}
        </div>
      );
    },
    size: 100,
  },
  { 
    id: 'status', 
    header: () => <span className="text-[10px] font-black uppercase tracking-[0.4em] text-flare-text-l">STATUS</span>, 
    cell: ({ row }) => {
      const config = getStatusConfig(row.original.status);
      const Icon = config.icon;
      return (
        <div className={cn('inline-flex items-center gap-2 text-[9px] tracking-[0.2em] font-black px-3 py-1.5 rounded-none border bg-[#05070A]', config.className)}>
          <Icon className="h-3 w-3" />
          <span className="hidden sm:inline">{row.original.status}</span>
        </div>
      );
    },
    size: 150,
  },
  {
    accessorKey: 'updated_at',
    header: () => <span className="text-[10px] font-black uppercase tracking-[0.4em] text-flare-text-l">UPDATED</span>,
    cell: ({ row }) => <span className="text-[11px] font-mono text-flare-text-l opacity-60">{formatTimeAgo(row.original.updated_at)}</span>,
    size: 120,
  },
  {
    id: 'trend',
    header: () => <span className="text-[10px] font-black uppercase tracking-[0.4em] text-flare-text-l">TREND</span>,
    cell: ({ row }) => <MiniSparkline address={row.original.address} score={row.original.trust_score} />,
    size: 120,
  },
  {
    id: 'action',
    header: () => <div className="text-[10px] font-black uppercase tracking-[0.4em] text-flare-text-l text-center w-full">SHARE</div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-center w-full">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            window.open(generateTwitterShareUrl(row.original), '_blank', 'noopener,noreferrer');
          }}
          title="Share Agent on X (Twitter)"
          className="text-flare-text-l opacity-40 hover:opacity-100 hover:text-[#1DA1F2] transition-colors p-2"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </button>
      </div>
    ),
    size: 80,
  }
];

export function AgentTable({ agents, onSortChange }: AgentTableProps) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data: agents, columns, getCoreRowModel: getCoreRowModel(), getSortedRowModel: getSortedRowModel(),
    onSortingChange: (updater) => {
      const newSorting = typeof updater === 'function' ? updater(sorting) : updater;
      setSorting(newSorting);
      if (onSortChange && newSorting.length > 0) { onSortChange(newSorting[0].id, newSorting[0].desc ? 'desc' : 'asc'); }
    },
    state: { sorting },
  });

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-b border-[#059669]/10 bg-[#0A0D12]/40 hover:bg-transparent">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  style={{ width: header.getSize() }}
                  className="py-2.5 text-flare-text-l"
                >
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              onClick={() => router.push(`/agents/${row.original.address}`)}
              className="group/row cursor-pointer border-b border-[#059669]/10 last:border-0 transition-colors hover:bg-[#4ADE80]/[0.03]"
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="py-2.5 text-flare-text-l group-hover/row:text-flare-text-h transition-colors">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}



