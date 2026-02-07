'use client';

import { useParams } from 'next/navigation';
import { ArrowLeft, Shield } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

/**
 * Agent Detail Page (Placeholder)
 * Will be fully implemented in a future issue
 */
export default function AgentDetailPage() {
  const params = useParams();
  const address = params.address as string;

  return (
    <div className="min-h-[calc(100vh-200px)] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <Button variant="ghost" asChild>
            <Link href="/scanner">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Scanner
            </Link>
          </Button>
        </div>

        {/* Placeholder Content */}
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-20 w-20 rounded-full bg-purple-500/10 flex items-center justify-center mb-6">
            <Shield className="h-10 w-10 text-purple-400" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">
            Agent Profile
          </h1>

          <p className="text-[rgba(255,255,255,0.6)] mb-4 max-w-md">
            Viewing agent at address:
          </p>

          <code className="px-4 py-2 bg-[rgba(255,255,255,0.05)] rounded-lg text-sm font-mono text-purple-400 mb-8">
            {address}
          </code>

          <p className="text-sm text-[rgba(255,255,255,0.5)]">
            Full agent profile page coming soon in a future update.
          </p>
        </div>
      </div>
    </div>
  );
}
