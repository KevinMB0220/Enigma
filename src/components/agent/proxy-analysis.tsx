'use client';

import { Shield, ShieldAlert, ShieldCheck, ExternalLink, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils/index';

/**
 * Proxy type enum values (matching Prisma)
 */
type ProxyType = 'NONE' | 'EIP1967' | 'BEACON' | 'TRANSPARENT' | 'UUPS' | 'CUSTOM';

/**
 * Proxy data from API
 */
export interface ProxyData {
  detected: boolean;
  type: ProxyType;
  implementationAddress: string | null;
}

/**
 * OZ Match data from API
 */
export interface OZMatchData {
  score: number;
  matchedComponents?: string[];
  matchPercentage?: number;
}

interface ProxyAnalysisProps {
  proxy: ProxyData;
  ozMatch: OZMatchData;
  agentAddress: string;
  className?: string;
}

/**
 * Proxy type descriptions
 */
const PROXY_TYPE_INFO: Record<ProxyType, { label: string; description: string }> = {
  NONE: {
    label: 'No Proxy',
    description: 'Contract is not a proxy',
  },
  EIP1967: {
    label: 'EIP-1967 Proxy',
    description: 'Standard transparent proxy pattern',
  },
  BEACON: {
    label: 'Beacon Proxy',
    description: 'Upgradeable via beacon contract',
  },
  TRANSPARENT: {
    label: 'Transparent Proxy',
    description: 'OpenZeppelin transparent proxy',
  },
  UUPS: {
    label: 'UUPS Proxy',
    description: 'Universal Upgradeable Proxy Standard',
  },
  CUSTOM: {
    label: 'Custom/Unknown',
    description: 'Non-standard proxy pattern detected',
  },
};

/**
 * ProxyAnalysis - Shows proxy detection status and OZ match results
 *
 * Features:
 * - Proxy detection status badge
 * - Implementation address display
 * - Warning for undeclared proxies
 * - OZ component match list
 */
export function ProxyAnalysis({
  proxy,
  ozMatch,
  agentAddress: _agentAddress,
  className,
}: ProxyAnalysisProps) {
  const isUndeclaredProxy = proxy.detected && proxy.type === 'CUSTOM';
  const isDeclaredProxy = proxy.detected && proxy.type !== 'CUSTOM' && proxy.type !== 'NONE';
  const noProxy = !proxy.detected;

  const snowtraceUrl = (address: string) => `https://snowtrace.io/address/${address}`;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Proxy Status Card */}
      <div className="rounded-lg bg-[rgba(15,17,23,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.06)] p-6">
        <div className="flex items-center gap-3 mb-4">
          {noProxy ? (
            <ShieldCheck className="h-5 w-5 text-green-400" />
          ) : isDeclaredProxy ? (
            <Shield className="h-5 w-5 text-yellow-400" />
          ) : (
            <ShieldAlert className="h-5 w-5 text-red-400" />
          )}
          <h3 className="text-lg font-semibold text-white">Proxy Analysis</h3>
        </div>

        {/* Status Badge */}
        <div className="mb-4">
          {noProxy && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/15 border border-green-500/30">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              <span className="text-sm font-medium text-green-400">No Proxy Detected</span>
            </div>
          )}

          {isDeclaredProxy && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/15 border border-yellow-500/30">
              <span className="h-2 w-2 rounded-full bg-yellow-400" />
              <span className="text-sm font-medium text-yellow-400">
                Proxy: {PROXY_TYPE_INFO[proxy.type].label}
              </span>
            </div>
          )}

          {isUndeclaredProxy && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/15 border border-red-500/30">
              <span className="h-2 w-2 rounded-full bg-red-400" />
              <span className="text-sm font-medium text-red-400">Undeclared Proxy</span>
            </div>
          )}
        </div>

        {/* Warning Banner for Undeclared Proxy */}
        {isUndeclaredProxy && (
          <div className="mb-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-400">Security Warning</p>
                <p className="text-sm text-red-400/80 mt-1">
                  This contract uses an undeclared or custom proxy pattern. This may indicate
                  potential upgrade risks or non-standard behavior. Exercise caution.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Proxy Details */}
        {proxy.detected && (
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-[rgba(255,255,255,0.06)]">
              <span className="text-sm text-[rgba(255,255,255,0.6)]">Pattern Type</span>
              <span className="text-sm font-medium text-white">
                {PROXY_TYPE_INFO[proxy.type].label}
              </span>
            </div>

            <p className="text-xs text-[rgba(255,255,255,0.5)]">
              {PROXY_TYPE_INFO[proxy.type].description}
            </p>

            {proxy.implementationAddress && (
              <div className="pt-2">
                <p className="text-sm text-[rgba(255,255,255,0.6)] mb-2">Implementation Address</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 bg-[rgba(255,255,255,0.05)] rounded text-xs font-mono text-purple-400 break-all">
                    {proxy.implementationAddress}
                  </code>
                  <a
                    href={snowtraceUrl(proxy.implementationAddress)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-[rgba(255,255,255,0.05)] rounded transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 text-[rgba(255,255,255,0.5)]" />
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {noProxy && (
          <p className="text-sm text-[rgba(255,255,255,0.6)]">
            This contract does not use a proxy pattern, meaning its code cannot be upgraded.
            This is generally considered more secure and predictable.
          </p>
        )}
      </div>

      {/* OZ Match Card */}
      <div className="rounded-lg bg-[rgba(15,17,23,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.06)] p-6">
        <h3 className="text-lg font-semibold text-white mb-4">OpenZeppelin Patterns</h3>

        {/* Score Display */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-[rgba(255,255,255,0.06)]">
          <span className="text-sm text-[rgba(255,255,255,0.6)]">Match Score</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-[rgba(31,41,55,0.6)] rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  ozMatch.score >= 80 ? 'bg-green-500' :
                  ozMatch.score >= 50 ? 'bg-blue-500' :
                  ozMatch.score >= 20 ? 'bg-yellow-500' :
                  'bg-red-500'
                )}
                style={{ width: `${ozMatch.score}%` }}
              />
            </div>
            <span className="text-sm font-medium text-white">{ozMatch.score}/100</span>
          </div>
        </div>

        {/* Matched Components */}
        {ozMatch.matchedComponents && ozMatch.matchedComponents.length > 0 ? (
          <div>
            <p className="text-sm text-[rgba(255,255,255,0.6)] mb-3">Detected Components:</p>
            <div className="flex flex-wrap gap-2">
              {ozMatch.matchedComponents.map((component) => (
                <span
                  key={component}
                  className="px-3 py-1.5 text-sm rounded-full bg-green-500/15 text-green-400 border border-green-500/20"
                >
                  {component}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <Shield className="h-10 w-10 text-[rgba(255,255,255,0.2)] mx-auto mb-3" />
            <p className="text-sm text-[rgba(255,255,255,0.5)]">
              No known OpenZeppelin patterns detected in this contract.
            </p>
            <p className="text-xs text-[rgba(255,255,255,0.4)] mt-1">
              This doesn&apos;t necessarily indicate a problem - the contract may use custom implementations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
