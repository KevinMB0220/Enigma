'use client';

import { useState } from 'react';
import { DashboardSidebar } from './dashboard-sidebar';
import { DashboardNavbar } from './dashboard-navbar';
import { cn } from '@/lib/utils';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-flare-bg relative">
      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* 
          Main Content Area 
          On Desktop: Padding left matches the collapsed sidebar (20 units / 80px)
          On Hover: The sidebar expands but we can choose to either push or overlap. 
          User said "maximize page space", so a fixed 80px gutter is ideal.
      */}
      <div className={cn(
        "flex min-w-0 flex-1 flex-col overflow-hidden transition-all duration-300 ease-in-out",
        "lg:pl-20"
      )}>
        <DashboardNavbar onMenuToggle={() => setSidebarOpen((p) => !p)} />
        <main className="flex-1 overflow-y-auto selection:bg-flare-accent selection:text-flare-bg">
          {children}
        </main>
      </div>
    </div>
  );
}
