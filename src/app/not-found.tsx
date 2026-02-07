import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div className="glass max-w-md p-12">
        <div className="mb-6 text-7xl font-extrabold text-primary/30">404</div>
        <h1 className="mb-3 text-2xl font-bold text-white">Page Not Found</h1>
        <p className="mb-8 text-sm text-text-secondary">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-dark px-6 py-2.5 text-sm font-semibold text-white shadow-primary transition-all hover:-translate-y-0.5"
          >
            <Home size={16} />
            Return Home
          </Link>
          <Link
            href="/scanner"
            className="inline-flex items-center gap-2 rounded-lg border border-border-light px-6 py-2.5 text-sm font-semibold text-white transition-all hover:border-border-primary hover:bg-glass"
          >
            <Search size={16} />
            Scanner
          </Link>
        </div>
      </div>
    </div>
  );
}
