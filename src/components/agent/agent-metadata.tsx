'use client';

import { ExternalLink, Globe, Zap, Shield, CheckCircle2 } from 'lucide-react';
import { type AgentMetadata } from '@/hooks/use-agent';
import { cn } from '@/lib/utils/index';

interface AgentMetadataProps {
  metadata: AgentMetadata | null;
}

export function AgentMetadataDisplay({ metadata }: AgentMetadataProps) {
  if (!metadata) {
    return (
      <div className="rounded-lg bg-[rgba(15,17,23,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.06)] p-6">
        <p className="text-sm text-[rgba(255,255,255,0.5)]">
          No metadata available for this agent.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Agent Image */}
      {metadata.image && (
        <div className="rounded-lg bg-[rgba(15,17,23,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.06)] p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Agent Avatar</h3>
          <img
            src={metadata.image}
            alt={metadata.name || 'Agent avatar'}
            className="w-32 h-32 rounded-lg object-cover border border-[rgba(255,255,255,0.1)]"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Services */}
      {metadata.services && metadata.services.length > 0 && (
        <div className="rounded-lg bg-[rgba(15,17,23,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.06)] p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5 text-purple-400" />
            Services & Endpoints
          </h3>
          <div className="space-y-3">
            {metadata.services.map((service, idx) => (
              <div
                key={idx}
                className="p-4 bg-[rgba(255,255,255,0.03)] rounded-lg border border-[rgba(255,255,255,0.05)] hover:border-purple-500/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <ServiceIcon name={service.name} />
                      <span className="text-sm font-semibold text-white capitalize">
                        {service.name}
                      </span>
                      {service.version && (
                        <span className="text-xs text-[rgba(255,255,255,0.4)] px-2 py-0.5 bg-[rgba(255,255,255,0.05)] rounded">
                          v{service.version}
                        </span>
                      )}
                    </div>
                    <code className="text-xs text-purple-300 break-all">
                      {service.endpoint}
                    </code>
                  </div>
                  <a
                    href={service.endpoint}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 p-2 hover:bg-[rgba(255,255,255,0.05)] rounded transition-colors"
                    title="Open endpoint"
                  >
                    <ExternalLink className="h-4 w-4 text-[rgba(255,255,255,0.6)]" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Capabilities */}
      <div className="rounded-lg bg-[rgba(15,17,23,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.06)] p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-400" />
          Capabilities
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <CapabilityBadge
            label="x402 Support"
            enabled={metadata.x402Support === true}
            description="Supports EIP-402 micropayments"
          />
          <CapabilityBadge
            label="Active Status"
            enabled={metadata.active === true}
            description="Agent is currently active"
          />
          {metadata.supportedTrust && metadata.supportedTrust.length > 0 && (
            <div className="col-span-full p-3 bg-[rgba(255,255,255,0.03)] rounded-lg">
              <p className="text-xs text-[rgba(255,255,255,0.6)] mb-2">Trust Systems:</p>
              <div className="flex flex-wrap gap-2">
                {metadata.supportedTrust.map((trust, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-xs rounded bg-purple-500/15 text-purple-300 border border-purple-500/20"
                  >
                    {trust}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Registrations */}
      {metadata.registrations && metadata.registrations.length > 0 && (
        <div className="rounded-lg bg-[rgba(15,17,23,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.06)] p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-400" />
            Cross-Chain Registrations
          </h3>
          <div className="space-y-2">
            {metadata.registrations.map((reg, idx) => (
              <div
                key={idx}
                className="p-3 bg-[rgba(255,255,255,0.03)] rounded-lg text-sm"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[rgba(255,255,255,0.6)]">Agent ID:</span>
                  <span className="font-mono text-emerald-400">#{reg.agentId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[rgba(255,255,255,0.6)]">Registry:</span>
                  <code className="text-xs text-[rgba(255,255,255,0.8)] break-all">
                    {reg.agentRegistry}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metadata Type */}
      {metadata.type && (
        <div className="rounded-lg bg-[rgba(15,17,23,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.06)] p-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[rgba(255,255,255,0.6)]">Metadata Standard:</span>
            <code className="text-xs text-blue-300 px-2 py-1 bg-blue-500/10 rounded">
              {metadata.type}
            </code>
          </div>
        </div>
      )}
    </div>
  );
}

function ServiceIcon({ name }: { name: string }) {
  const iconClass = 'h-4 w-4';

  switch (name.toLowerCase()) {
    case 'web':
      return <Globe className={cn(iconClass, 'text-blue-400')} />;
    case 'a2a':
      return <Zap className={cn(iconClass, 'text-yellow-400')} />;
    case 'mcp':
      return <Shield className={cn(iconClass, 'text-emerald-400')} />;
    default:
      return <ExternalLink className={cn(iconClass, 'text-purple-400')} />;
  }
}

function CapabilityBadge({
  label,
  enabled,
  description,
}: {
  label: string;
  enabled: boolean;
  description: string;
}) {
  return (
    <div
      className={cn(
        'p-3 rounded-lg border transition-colors',
        enabled
          ? 'bg-green-500/10 border-green-500/30'
          : 'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.05)]'
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        <CheckCircle2
          className={cn(
            'h-4 w-4',
            enabled ? 'text-green-400' : 'text-[rgba(255,255,255,0.3)]'
          )}
        />
        <span className={cn('text-sm font-medium', enabled ? 'text-green-400' : 'text-[rgba(255,255,255,0.6)]')}>
          {label}
        </span>
      </div>
      <p className="text-xs text-[rgba(255,255,255,0.5)]">{description}</p>
    </div>
  );
}
