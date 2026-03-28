'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface AgentTableSkeletonProps {
  rows?: number;
}

export function AgentTableSkeleton({ rows = 10 }: AgentTableSkeletonProps) {
  const skeletonRows = Array.from({ length: rows });

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-white/[0.02] bg-black/10 hover:bg-black/10">
            {['#', 'Name', 'Type', 'Score', 'Status', 'Update', 'Trend', 'X'].map((h, i) => (
              <TableHead key={i} className="h-10 py-0 text-flare-text-l px-8 first:px-8">
                <div className="flex items-center gap-2">
                   <span className="text-[10px] font-black uppercase tracking-[0.2em]">{h}</span>
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {skeletonRows.map((_, i) => (
            <TableRow key={i} className="border-b border-white/[0.02] last:border-0 h-16">
              <TableCell className="px-8">
                <div className="h-2 w-4 bg-white/5 animate-pulse rounded-none" />
              </TableCell>
              <TableCell className="px-8">
                <div className="flex items-center gap-5">
                  <div className="h-9 w-9 bg-white/5 animate-pulse rounded-none" />
                  <div className="space-y-2">
                    <div className="h-3 w-32 bg-white/5 animate-pulse rounded-none" />
                    <div className="h-2 w-20 bg-white/5 animate-pulse rounded-none opacity-50" />
                  </div>
                </div>
              </TableCell>
              <TableCell className="px-8">
                <div className="h-5 w-16 bg-white/5 animate-pulse rounded-none" />
              </TableCell>
              <TableCell className="px-8">
                <div className="h-6 w-12 bg-white/5 animate-pulse rounded-none" />
              </TableCell>
              <TableCell className="px-8">
                <div className="h-3 w-20 bg-white/5 animate-pulse rounded-none" />
              </TableCell>
              <TableCell className="px-8">
                <div className="h-3 w-16 bg-white/5 animate-pulse rounded-none opacity-20" />
              </TableCell>
              <TableCell className="px-8">
                <div className="h-4 w-16 bg-white/5 animate-pulse rounded-none opacity-10" />
              </TableCell>
              <TableCell className="px-8">
                <div className="h-8 w-8 bg-white/5 animate-pulse rounded-none opacity-5" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
