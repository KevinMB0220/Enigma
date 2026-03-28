import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'API Reference — FLARE',
  description: 'Full REST API reference for the FLARE agent registry on Avalanche. Endpoints, parameters, and response shapes.',
};

// ── Types ─────────────────────────────────────────────────────────────────────

interface Param {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface Endpoint {
  method: 'GET' | 'POST' | 'DELETE';
  path: string;
  description: string;
  auth?: string;
  params?: Param[];
  responseExample: string;
}

interface EndpointGroup {
  title: string;
  description: string;
  accentColor: string;
  endpoints: Endpoint[];
}

// ── Data ──────────────────────────────────────────────────────────────────────

const groups: EndpointGroup[] = [
  {
    title: 'Agents',
    description: 'List, search, and retrieve agent profiles from the on-chain registry.',
    accentColor: '#4ADE80',
    endpoints: [
      {
        method: 'GET',
        path: '/api/v1/agents',
        description: 'List all agents with optional filters, sorting, and pagination.',
        params: [
          { name: 'type',          type: 'string',  required: false, description: 'Filter by agent type (e.g. MCP, A2A, WEB)' },
          { name: 'status',        type: 'string',  required: false, description: 'Filter by status: VERIFIED | PENDING | FLAGGED | SUSPENDED' },
          { name: 'minTrustScore', type: 'number',  required: false, description: 'Minimum trust score (0–100)' },
          { name: 'search',        type: 'string',  required: false, description: 'Full-text search on name and description' },
          { name: 'sortBy',        type: 'string',  required: false, description: 'Sort field: trust_score | created_at | updated_at' },
          { name: 'sortOrder',     type: 'string',  required: false, description: 'asc | desc (default: desc)' },
          { name: 'page',          type: 'number',  required: false, description: 'Page number (default: 1)' },
          { name: 'limit',         type: 'number',  required: false, description: 'Items per page (default: 20, max: 100)' },
        ],
        responseExample: `{
  "data": [
    {
      "address": "0x1a2b3c…",
      "name": "AlphaBot",
      "type": "MCP",
      "status": "VERIFIED",
      "trust_score": 87,
      "services": ["mcp"],
      "created_at": "2025-01-10T12:00:00Z",
      "updated_at": "2025-06-01T08:30:00Z"
    }
  ],
  "error": null,
  "meta": { "page": 1, "limit": 20, "total": 1693, "totalPages": 85 }
}`,
      },
      {
        method: 'GET',
        path: '/api/v1/agents/:address',
        description: 'Get full details for a single agent including services, capabilities, and registrations.',
        responseExample: `{
  "data": {
    "address": "0x1a2b3c…",
    "name": "AlphaBot",
    "type": "MCP",
    "status": "VERIFIED",
    "trust_score": 87,
    "description": "Autonomous MCP agent for DeFi analytics",
    "owner_address": "0xabc…",
    "services": ["mcp"],
    "capabilities": ["swap", "bridge"],
    "registrations": ["avalanche-c-chain"],
    "created_at": "2025-01-10T12:00:00Z",
    "updated_at": "2025-06-01T08:30:00Z"
  },
  "error": null
}`,
      },
      {
        method: 'GET',
        path: '/api/v1/agents/stats',
        description: 'Aggregated platform statistics: total agents, verified count, active in last 24 h, breakdown by type and status.',
        responseExample: `{
  "data": {
    "total": 1693,
    "verified": 412,
    "active24h": 38,
    "byStatus": { "VERIFIED": 412, "PENDING": 1201, "FLAGGED": 47, "SUSPENDED": 33 },
    "byType":   { "MCP": 540, "A2A": 320, "WEB": 610, "CUSTOM": 223 }
  },
  "error": null
}`,
      },
      {
        method: 'GET',
        path: '/api/v1/agents/sparklines',
        description: 'Batch fetch the last 10 trust score snapshots for up to 50 agents (for sparkline charts).',
        params: [
          { name: 'addresses', type: 'string', required: true, description: 'Comma-separated list of agent addresses (max 50)' },
        ],
        responseExample: `{
  "data": {
    "0x1a2b3c…": [{ "v": 72 }, { "v": 75 }, { "v": 80 }, { "v": 87 }],
    "0x4d5e6f…": [{ "v": 55 }, { "v": 60 }]
  },
  "error": null
}`,
      },
    ],
  },
  {
    title: 'Trust Score',
    description: 'Retrieve the weighted trust score breakdown for any agent.',
    accentColor: '#22D3EE',
    endpoints: [
      {
        method: 'GET',
        path: '/api/v1/agents/:address/trust-score',
        description: 'Full trust score breakdown with individual component scores, weights, and details.',
        responseExample: `{
  "data": {
    "address": "0x1a2b3c…",
    "score": 87,
    "breakdown": {
      "volume":  { "score": 90, "weight": 0.25, "weighted": 22.5, "details": { … } },
      "proxy":   { "score": 85, "weight": 0.20, "weighted": 17.0, "details": { … } },
      "uptime":  { "score": 92, "weight": 0.25, "weighted": 23.0, "details": { … } },
      "ozMatch": { "score": 78, "weight": 0.15, "weighted": 11.7, "details": { … } },
      "ratings": { "score": 82, "weight": 0.15, "weighted": 12.3, "details": { … } }
    },
    "lastUpdated": "2025-06-01T08:30:00Z"
  },
  "error": null
}`,
      },
    ],
  },
  {
    title: 'Ratings',
    description: 'Community ratings for agents. Submit and retrieve 1–5 star ratings.',
    accentColor: '#FCD34D',
    endpoints: [
      {
        method: 'GET',
        path: '/api/v1/agents/:address/ratings',
        description: 'Retrieve paginated community ratings for an agent.',
        params: [
          { name: 'page',  type: 'number', required: false, description: 'Page number (default: 1)' },
          { name: 'limit', type: 'number', required: false, description: 'Items per page (default: 10)' },
        ],
        responseExample: `{
  "data": [
    { "id": "…", "score": 5, "comment": "Great agent!", "rater_address": "0x…", "created_at": "…" }
  ],
  "error": null,
  "meta": { "page": 1, "limit": 10, "total": 42, "totalPages": 5 }
}`,
      },
      {
        method: 'POST',
        path: '/api/v1/agents/:address/ratings',
        description: 'Submit a community rating (1–5) for an agent. Requires a connected wallet.',
        auth: 'Wallet signature required',
        params: [
          { name: 'score',   type: 'number', required: true,  description: 'Rating from 1 to 5' },
          { name: 'comment', type: 'string', required: false, description: 'Optional text comment (max 500 chars)' },
          { name: 'wallet',  type: 'string', required: true,  description: 'Connected wallet address' },
        ],
        responseExample: `{
  "data": { "id": "…", "score": 5, "comment": "Great agent!", "created_at": "…" },
  "error": null
}`,
      },
    ],
  },
  {
    title: 'Reports',
    description: 'Submit reports for agents that violate platform policies.',
    accentColor: '#FB7185',
    endpoints: [
      {
        method: 'POST',
        path: '/api/v1/agents/:address/reports',
        description: 'Report an agent with a reason and optional description. Requires a connected wallet.',
        auth: 'Wallet signature required',
        params: [
          { name: 'reason',      type: 'string', required: true,  description: 'Report category: SPAM | SCAM | MALICIOUS | OTHER' },
          { name: 'description', type: 'string', required: false, description: 'Additional details (max 1000 chars)' },
          { name: 'wallet',      type: 'string', required: true,  description: 'Connected wallet address' },
        ],
        responseExample: `{
  "data": { "id": "…", "reason": "SCAM", "created_at": "…" },
  "error": null
}`,
      },
    ],
  },
  {
    title: 'Registration',
    description: 'Register a new autonomous agent on the FLARE registry.',
    accentColor: '#A78BFA',
    endpoints: [
      {
        method: 'POST',
        path: '/api/v1/agents/register',
        description: 'Register a new agent on-chain. Triggers ERC-8004 tokenURI resolution and initial trust score calculation.',
        auth: 'Wallet signature required',
        params: [
          { name: 'address',     type: 'string', required: true,  description: 'Agent contract address on Avalanche C-Chain' },
          { name: 'name',        type: 'string', required: true,  description: 'Human-readable agent name (max 100 chars)' },
          { name: 'description', type: 'string', required: false, description: 'Agent description (max 500 chars)' },
          { name: 'type',        type: 'string', required: true,  description: 'Agent type: MCP | A2A | WEB | CUSTOM' },
          { name: 'wallet',      type: 'string', required: true,  description: 'Owner wallet address' },
        ],
        responseExample: `{
  "data": {
    "address": "0x1a2b3c…",
    "name": "MyAgent",
    "status": "PENDING",
    "trust_score": 0
  },
  "error": null
}`,
      },
    ],
  },
  {
    title: 'System',
    description: 'Platform health and activity data.',
    accentColor: '#64748B',
    endpoints: [
      {
        method: 'GET',
        path: '/api/v1/health',
        description: 'Health check endpoint. Returns service status and database connectivity.',
        responseExample: `{
  "data": {
    "status": "ok",
    "database": "connected",
    "timestamp": "2025-06-01T08:30:00Z"
  },
  "error": null
}`,
      },
      {
        method: 'GET',
        path: '/api/v1/agents/activity',
        description: 'Agent registration and verification activity over time (used by the Activity Chart).',
        params: [
          { name: 'days', type: 'number', required: false, description: 'Number of past days to return (default: 30)' },
        ],
        responseExample: `{
  "data": [
    { "date": "2025-05-31", "registrations": 12, "verifications": 4 },
    { "date": "2025-06-01", "registrations": 7,  "verifications": 2 }
  ],
  "error": null
}`,
      },
    ],
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────

const METHOD_STYLE: Record<string, string> = {
  GET:    'bg-[rgba(74,222,128,0.12)] text-[#4ADE80] border-[rgba(74,222,128,0.25)]',
  POST:   'bg-[rgba(34,211,238,0.12)] text-[#22D3EE] border-[rgba(34,211,238,0.25)]',
  DELETE: 'bg-[rgba(251,113,133,0.12)] text-[#FB7185] border-[rgba(251,113,133,0.25)]',
};

function MethodBadge({ method }: { method: string }) {
  return (
    <span className={cn('rounded border px-2 py-0.5 font-mono text-[10px] font-bold', METHOD_STYLE[method])}>
      {method}
    </span>
  );
}

function EndpointBlock({ endpoint, accentColor }: { endpoint: Endpoint; accentColor: string }) {
  return (
    <div className="border-b border-[rgba(255,255,255,0.05)] py-6 last:border-0">
      {/* Path + method */}
      <div className="mb-2 flex flex-wrap items-center gap-3">
        <MethodBadge method={endpoint.method} />
        <code className="font-mono text-sm text-white">{endpoint.path}</code>
        {endpoint.auth && (
          <span className="rounded-full border border-[rgba(252,211,77,0.25)] bg-[rgba(252,211,77,0.08)] px-2 py-0.5 text-[10px] text-[#FCD34D]">
            🔒 {endpoint.auth}
          </span>
        )}
      </div>

      <p className="mb-4 text-sm text-[#64748B]">{endpoint.description}</p>

      {/* Params */}
      {endpoint.params && endpoint.params.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#475569]">Parameters</p>
          <div className="overflow-hidden rounded-lg border border-[rgba(255,255,255,0.06)]">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)]">
                  <th className="px-3 py-2 text-left font-semibold text-[#475569]">Name</th>
                  <th className="px-3 py-2 text-left font-semibold text-[#475569]">Type</th>
                  <th className="px-3 py-2 text-left font-semibold text-[#475569]">Required</th>
                  <th className="px-3 py-2 text-left font-semibold text-[#475569]">Description</th>
                </tr>
              </thead>
              <tbody>
                {endpoint.params.map((p) => (
                  <tr key={p.name} className="border-b border-[rgba(255,255,255,0.04)] last:border-0">
                    <td className="px-3 py-2 font-mono" style={{ color: accentColor }}>{p.name}</td>
                    <td className="px-3 py-2 font-mono text-[#94A3B8]">{p.type}</td>
                    <td className="px-3 py-2">
                      {p.required
                        ? <span className="text-[#FB7185]">Yes</span>
                        : <span className="text-[#475569]">No</span>
                      }
                    </td>
                    <td className="px-3 py-2 text-[#64748B]">{p.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Response example */}
      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#475569]">Response</p>
        <pre className={cn(
          'overflow-x-auto rounded-lg border border-[rgba(255,255,255,0.06)] p-4',
          'bg-[rgba(255,255,255,0.02)] font-mono text-[12px] leading-relaxed text-[#94A3B8]',
        )}>
          {endpoint.responseExample}
        </pre>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ApiDocsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">

      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-1.5 text-xs text-[#475569]">
        <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-[#94A3B8]">API Reference</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <Link
          href="/docs"
          className="mb-4 inline-flex items-center gap-1.5 text-xs text-[#64748B] transition-colors hover:text-white"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Docs
        </Link>
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-white">API Reference</h1>
        <p className="max-w-lg text-sm text-[#64748B]">
          All endpoints follow a standard response envelope with <code className="font-mono text-[#94A3B8]">data</code>, <code className="font-mono text-[#94A3B8]">error</code>, and optional <code className="font-mono text-[#94A3B8]">meta</code> fields.
          Base URL: <code className="font-mono text-primary">https://flare.app</code>
        </p>
      </div>

      {/* Standard response format */}
      <div className={cn(
        'mb-8 rounded-xl border border-[rgba(74,222,128,0.15)] p-5',
        'bg-[rgba(74,222,128,0.04)]',
      )}>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#4ADE80]">Standard Response Format</p>
        <pre className="overflow-x-auto font-mono text-[12px] leading-relaxed text-[#94A3B8]">{`{
  "data":  { … } | null,
  "error": null   | { "message": "…", "code": "…", "fields": { … } },
  "meta":  { "page": 1, "limit": 20, "total": 1693, "totalPages": 85 }
}`}</pre>
      </div>

      {/* Endpoint groups */}
      <div className="flex flex-col gap-8">
        {groups.map((group) => (
          <section key={group.title} className="glass overflow-hidden">
            {/* Group header */}
            <div
              className="border-b border-[rgba(255,255,255,0.06)] px-6 py-4"
              style={{ background: `${group.accentColor}06` }}
            >
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full" style={{ background: group.accentColor }} />
                <h2 className="text-sm font-semibold text-white">{group.title}</h2>
              </div>
              <p className="mt-1 text-xs text-[#64748B]">{group.description}</p>
            </div>

            {/* Endpoints */}
            <div className="px-6">
              {group.endpoints.map((ep) => (
                <EndpointBlock key={ep.path + ep.method} endpoint={ep} accentColor={group.accentColor} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
