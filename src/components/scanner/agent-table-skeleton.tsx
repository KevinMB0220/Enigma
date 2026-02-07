'use client';

import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface AgentTableSkeletonProps {
  rows?: number;
}

/**
 * Loading skeleton for the AgentTable component
 * Displays shimmer animation matching table structure
 */
export function AgentTableSkeleton({ rows = 10 }: AgentTableSkeletonProps) {
  return (
    <div className="rounded-md border border-[rgba(255,255,255,0.06)]">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-[rgba(255,255,255,0.06)] hover:bg-transparent">
            <TableHead className="w-[60px]">Rank</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="w-[100px]">Type</TableHead>
            <TableHead className="w-[120px]">Trust Score</TableHead>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead className="w-[120px]">Last Ping</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, index) => (
            <TableRow
              key={index}
              className="border-b border-[rgba(255,255,255,0.06)]"
            >
              <TableCell>
                <Skeleton className="h-5 w-8" />
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-20 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-16 rounded-md" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-16 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-16" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
