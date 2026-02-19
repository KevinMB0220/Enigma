import { DashboardSidebar, DashboardNavbar } from '@/components/layout';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#0B0F14]">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardNavbar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
