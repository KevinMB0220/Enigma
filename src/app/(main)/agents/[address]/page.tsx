'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import {
  ArrowLeft,
  Shield,
  Copy,
  Check,
  ExternalLink,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrustScoreBadge } from '@/components/shared/trust-score-badge';
import { TrustScoreBreakdown } from '@/components/agent/trust-score-breakdown';
import { RatingForm } from '@/components/agent/rating-form';
import { ReportModal } from '@/components/agent/report-modal';
import { useAgent, type AgentDetail } from '@/hooks/use-agent';
import { cn } from '@/lib/utils/index';

/**
 * Status badge colors
 */
const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  VERIFIED: { bg: 'bg-green-500/15', text: 'text-green-400' },
  PENDING: { bg: 'bg-yellow-500/15', text: 'text-yellow-400' },
  FLAGGED: { bg: 'bg-orange-500/15', text: 'text-orange-400' },
  SUSPENDED: { bg: 'bg-red-500/15', text: 'text-red-400' },
};

/**
 * Agent type labels
 */
const TYPE_LABELS: Record<string, string> = {
  TRADING: 'Trading Bot',
  LENDING: 'Lending Protocol',
  GOVERNANCE: 'Governance Agent',
  ORACLE: 'Oracle Provider',
  CUSTOM: 'Custom Agent',
};

/**
 * Agent Profile Page
 * Displays detailed agent information with tabbed interface
 */
export default function AgentProfilePage() {
  const params = useParams();
  const address = params.address as string;
  const [copied, setCopied] = useState(false);

  const { data: agent, isLoading, isError, error, refetch } = useAgent(address, {
    refetchInterval: 60 * 1000, // Refetch every minute
  });

  // Copy address to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Snowtrace link - points to NFT in Identity Registry
  const snowtraceUrl = agent?.registryAddress && agent?.tokenId
    ? `https://snowtrace.io/token/${agent.registryAddress}?a=${agent.tokenId}#inventory`
    : `https://snowtrace.io/address/${address}`;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-[rgba(255,255,255,0.6)]">Loading agent profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-[calc(100vh-200px)] py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button variant="ghost" asChild>
              <Link href="/scanner">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Scanner
              </Link>
            </Button>
          </div>

          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-16 w-16 rounded-full bg-red-500/15 flex items-center justify-center mb-6">
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
            <h1 className="text-xl font-bold text-white mb-2">Agent Not Found</h1>
            <p className="text-[rgba(255,255,255,0.6)] mb-6 max-w-md">
              {error?.message || 'Unable to load agent details.'}
            </p>
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!agent) {
    return null;
  }

  const statusStyle = STATUS_STYLES[agent.status] || STATUS_STYLES.PENDING;

  return (
    <div className="min-h-[calc(100vh-200px)] py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="text-[rgba(255,255,255,0.6)] hover:text-white">
            <Link href="/scanner">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Scanner
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="rounded-lg bg-[rgba(15,17,23,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.06)] p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Agent Icon and Trust Score */}
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-purple-500/15 flex items-center justify-center">
                <Shield className="h-8 w-8 text-purple-400" />
              </div>
              <TrustScoreBadge
                score={agent.trustScore.score}
                size="lg"
                lastUpdated={agent.trustScore.lastUpdated}
              />
            </div>

            {/* Agent Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-white">{agent.name}</h1>
                <span className={cn('px-2 py-0.5 rounded text-xs font-medium', statusStyle.bg, statusStyle.text)}>
                  {agent.status}
                </span>
              </div>

              <p className="text-sm text-[rgba(255,255,255,0.5)] mb-3">
                {TYPE_LABELS[agent.type] || agent.type}
              </p>

              {/* ERC-8004 Identity Registry Info */}
              <div className="space-y-2">
                {agent.tokenId && agent.registryAddress && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[rgba(255,255,255,0.4)]">ERC-8004 NFT:</span>
                    <code className="px-2 py-0.5 bg-[rgba(255,255,255,0.05)] rounded text-xs font-mono text-purple-300">
                      Token #{agent.tokenId}
                    </code>
                    <Button variant="ghost" size="sm" asChild className="h-6 w-6 p-0">
                      <a href={snowtraceUrl} target="_blank" rel="noopener noreferrer" title="View on Snowtrace">
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[rgba(255,255,255,0.4)]">Address:</span>
                  <code className="px-2 py-0.5 bg-[rgba(255,255,255,0.05)] rounded text-xs font-mono text-[rgba(255,255,255,0.6)]">
                    {address.slice(0, 10)}...{address.slice(-8)}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="h-6 w-6 p-0"
                    title="Copy address"
                  >
                    {copied ? (
                      <Check className="h-3 w-3 text-green-400" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>

                {agent.ownerAddress && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[rgba(255,255,255,0.4)]">Owner:</span>
                    <code className="px-2 py-0.5 bg-[rgba(255,255,255,0.05)] rounded text-xs font-mono text-[rgba(255,255,255,0.6)]">
                      {agent.ownerAddress.slice(0, 10)}...{agent.ownerAddress.slice(-8)}
                    </code>
                    <Button variant="ghost" size="sm" asChild className="h-6 w-6 p-0">
                      <a
                        href={`https://snowtrace.io/address/${agent.ownerAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View owner on Snowtrace"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                )}
              </div>

              {agent.description && (
                <p className="mt-3 text-sm text-[rgba(255,255,255,0.6)]">
                  {agent.description}
                </p>
              )}

              <div className="mt-3">
                <ReportModal agentAddress={address} />
              </div>
            </div>
          </div>

          {/* Flagged Warning */}
          {agent.status === 'FLAGGED' && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-3">
              <AlertCircle size={16} className="shrink-0 text-yellow-500" />
              <p className="text-sm text-yellow-400">
                This agent has been flagged by the community and is under review.
              </p>
            </div>
          )}
        </div>

        {/* Tabbed Content */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start bg-[rgba(15,17,23,0.6)] border border-[rgba(255,255,255,0.06)] mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
            <TabsTrigger value="heartbeat">Heartbeat</TabsTrigger>
            <TabsTrigger value="ratings">Ratings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Trust Score Breakdown */}
              <TrustScoreBreakdown
                data={{
                  score: agent.trustScore.score,
                  breakdown: agent.trustScore.breakdown,
                  lastUpdated: agent.trustScore.lastUpdated,
                }}
              />

              {/* Volume Stats */}
              <div className="rounded-lg bg-[rgba(15,17,23,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.06)] p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Transaction Volume
                </h3>
                <div className="space-y-4">
                  <VolumeCard label="24 Hours" data={agent.volumes.day} />
                  <VolumeCard label="7 Days" data={agent.volumes.week} />
                  <VolumeCard label="30 Days" data={agent.volumes.month} />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Verification Tab */}
          <TabsContent value="verification">
            <VerificationTab agent={agent} />
          </TabsContent>

          {/* Heartbeat Tab */}
          <TabsContent value="heartbeat">
            <HeartbeatTab agent={agent} />
          </TabsContent>

          {/* Ratings Tab */}
          <TabsContent value="ratings">
            <RatingsTab agent={agent} agentAddress={address} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

/**
 * Volume card component
 */
function VolumeCard({ label, data }: { label: string; data?: { txCount: number; volumeAvax: string; volumeUsd: string } }) {
  if (!data) {
    return (
      <div className="flex items-center justify-between py-3 border-b border-[rgba(255,255,255,0.06)] last:border-0">
        <span className="text-sm text-[rgba(255,255,255,0.6)]">{label}</span>
        <span className="text-sm text-[rgba(255,255,255,0.4)]">No data</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between py-3 border-b border-[rgba(255,255,255,0.06)] last:border-0">
      <span className="text-sm text-[rgba(255,255,255,0.6)]">{label}</span>
      <div className="text-right">
        <p className="text-sm font-medium text-white">
          {parseFloat(data.volumeAvax).toFixed(2)} AVAX
        </p>
        <p className="text-xs text-[rgba(255,255,255,0.5)]">
          ${parseFloat(data.volumeUsd).toLocaleString()} • {data.txCount} txs
        </p>
      </div>
    </div>
  );
}

/**
 * Verification tab content
 */
function VerificationTab({ agent }: { agent: AgentDetail }) {
  const proxyStatusColor = agent.proxy.detected
    ? agent.proxy.type !== 'CUSTOM'
      ? 'text-yellow-400'
      : 'text-red-400'
    : 'text-green-400';

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Proxy Analysis */}
      <div className="rounded-lg bg-[rgba(15,17,23,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.06)] p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Proxy Analysis</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[rgba(255,255,255,0.6)]">Proxy Detected</span>
            <span className={cn('text-sm font-medium', proxyStatusColor)}>
              {agent.proxy.detected ? 'Yes' : 'No'}
            </span>
          </div>
          {agent.proxy.detected && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[rgba(255,255,255,0.6)]">Proxy Type</span>
                <span className="text-sm font-medium text-white">{agent.proxy.type}</span>
              </div>
              {agent.proxy.implementationAddress && (
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-[rgba(255,255,255,0.6)]">Implementation</span>
                  <code className="text-xs font-mono text-purple-400 break-all">
                    {agent.proxy.implementationAddress}
                  </code>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* OZ Match Results */}
      <div className="rounded-lg bg-[rgba(15,17,23,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.06)] p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Security Patterns</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[rgba(255,255,255,0.6)]">OZ Match Score</span>
            <span className="text-sm font-medium text-white">
              {agent.trustScore.breakdown.ozMatch.score}/100
            </span>
          </div>
          {(() => {
            const components = agent.trustScore.breakdown.ozMatch.details.matchedComponents as string[] | undefined;
            if (!components || components.length === 0) {
              return (
                <p className="text-sm text-[rgba(255,255,255,0.5)]">
                  No known OpenZeppelin patterns detected
                </p>
              );
            }
            return (
              <div>
                <p className="text-sm text-[rgba(255,255,255,0.6)] mb-2">Matched Components:</p>
                <div className="flex flex-wrap gap-2">
                  {components.map((comp) => (
                    <span
                      key={comp}
                      className="px-2 py-1 text-xs rounded bg-green-500/15 text-green-400"
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

/**
 * Heartbeat tab content
 */
function HeartbeatTab({ agent }: { agent: AgentDetail }) {
  return (
    <div className="rounded-lg bg-[rgba(15,17,23,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.06)] p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Uptime Statistics (7 Days)</h3>
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Uptime" value={`${agent.uptime.percentage.toFixed(1)}%`} />
        <StatCard label="Total Pings" value={agent.uptime.totalPings.toString()} />
        <StatCard label="Successful" value={agent.uptime.successfulPings.toString()} color="green" />
        <StatCard label="Failed/Timeout" value={(agent.uptime.failedPings + agent.uptime.timeoutPings).toString()} color="red" />
      </div>
      <div className="mt-4 p-4 bg-[rgba(255,255,255,0.03)] rounded-lg">
        <p className="text-sm text-[rgba(255,255,255,0.6)]">
          Average Response Time:{' '}
          <span className="font-medium text-white">
            {agent.uptime.averageResponseTimeMs}ms
          </span>
        </p>
      </div>
      <p className="mt-4 text-sm text-[rgba(255,255,255,0.5)]">
        Heartbeat chart visualization coming soon in a future update.
      </p>
    </div>
  );
}

/**
 * Stat card component
 */
function StatCard({ label, value, color }: { label: string; value: string; color?: 'green' | 'red' }) {
  const valueColor = color === 'green' ? 'text-green-400' : color === 'red' ? 'text-red-400' : 'text-white';
  return (
    <div className="p-4 bg-[rgba(255,255,255,0.03)] rounded-lg">
      <p className="text-sm text-[rgba(255,255,255,0.6)]">{label}</p>
      <p className={cn('text-2xl font-bold', valueColor)}>{value}</p>
    </div>
  );
}

/**
 * Ratings tab content
 */
function RatingsTab({ agent, agentAddress }: { agent: AgentDetail; agentAddress: string }) {
  return (
    <div className="space-y-6">
      {/* Rating Form */}
      <RatingForm agentAddress={agentAddress} />

      {/* Ratings List */}
      <div className="rounded-lg bg-[rgba(15,17,23,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.06)] p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Community Ratings</h3>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">{agent.ratings.average.toFixed(1)}</p>
            <p className="text-sm text-[rgba(255,255,255,0.5)]">{agent.ratings.count} ratings</p>
          </div>
        </div>

        {agent.ratings.count === 0 ? (
          <p className="text-center text-[rgba(255,255,255,0.5)] py-8">
            No ratings yet. Be the first to rate this agent!
          </p>
        ) : (
        <div className="space-y-4">
          {agent.ratings.recent.map((rating) => (
            <div
              key={rating.id}
              className="p-4 bg-[rgba(255,255,255,0.03)] rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">{'★'.repeat(rating.rating)}</span>
                  <span className="text-[rgba(255,255,255,0.3)]">{'★'.repeat(5 - rating.rating)}</span>
                </div>
                <span className="text-xs text-[rgba(255,255,255,0.5)]">
                  {new Date(rating.createdAt).toLocaleDateString()}
                </span>
              </div>
              {rating.review && (
                <p className="text-sm text-[rgba(255,255,255,0.7)]">{rating.review}</p>
              )}
              <p className="text-xs text-[rgba(255,255,255,0.4)] mt-2">
                by {rating.userAddress.slice(0, 6)}...{rating.userAddress.slice(-4)}
              </p>
            </div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
}
