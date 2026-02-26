import type { Metadata } from 'next';
import Link from 'next/link';
import {
  BookOpen,
  FileCode2,
  Shield,
  Layers,
  Cpu,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Terminal,
  AlertTriangle,
  CheckCircle2,
  Info,
  UserPlus,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Documentation — Enigma',
  description: 'Learn how Enigma works: trust scores, ERC-8004 agent registry, API reference, and more.',
};

// ── Shared primitives ──────────────────────────────────────────────────────

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="mb-4 mt-12 flex items-center gap-2 border-b border-[rgba(255,255,255,0.06)] pb-3 text-xl font-bold text-white first:mt-0"
    >
      {children}
    </h2>
  );
}

function SubHeading({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h3 id={id} className="mb-2 mt-6 text-sm font-semibold text-white">
      {children}
    </h3>
  );
}

function Para({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 text-sm leading-relaxed text-[#94A3B8]">{children}</p>;
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-[rgba(255,255,255,0.06)] px-1.5 py-0.5 font-mono text-[12px] text-[#4ADE80]">
      {children}
    </code>
  );
}

function CodeBlock({ children, lang = 'json' }: { children: string; lang?: string }) {
  return (
    <div className="relative mb-4 overflow-hidden rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(0,0,0,0.4)]">
      <div className="flex items-center gap-2 border-b border-[rgba(255,255,255,0.06)] px-4 py-2">
        <Terminal className="h-3 w-3 text-[#475569]" />
        <span className="font-mono text-[11px] text-[#475569]">{lang}</span>
      </div>
      <pre className="overflow-x-auto px-4 py-3">
        <code className="font-mono text-[12px] leading-relaxed text-[#CBD5E1]">{children}</code>
      </pre>
    </div>
  );
}

function Callout({
  type = 'info',
  children,
}: {
  type?: 'info' | 'warn' | 'success';
  children: React.ReactNode;
}) {
  const styles = {
    info:    { icon: Info,          border: 'border-[rgba(34,211,238,0.2)]',  bg: 'bg-[rgba(34,211,238,0.05)]',  text: 'text-[#22D3EE]' },
    warn:    { icon: AlertTriangle, border: 'border-[rgba(252,211,77,0.2)]',  bg: 'bg-[rgba(252,211,77,0.05)]',  text: 'text-[#FCD34D]' },
    success: { icon: CheckCircle2,  border: 'border-[rgba(74,222,128,0.2)]',  bg: 'bg-[rgba(74,222,128,0.05)]',  text: 'text-[#4ADE80]'  },
  };
  const s = styles[type];
  const Icon = s.icon;
  return (
    <div className={cn('mb-4 flex gap-3 rounded-xl border p-4', s.border, s.bg)}>
      <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', s.text)} />
      <p className="text-sm leading-relaxed text-[#94A3B8]">{children}</p>
    </div>
  );
}

function ScoreRow({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-44 text-xs text-[#94A3B8]">{label}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[rgba(255,255,255,0.06)]">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="w-8 text-right font-mono text-xs font-semibold text-white">{pct}%</span>
    </div>
  );
}

// ── Table of contents ──────────────────────────────────────────────────────

const toc = [
  { id: 'intro',         label: 'Introduction',           icon: BookOpen  },
  { id: 'quickstart',    label: 'Quick Start',            icon: ArrowRight },
  { id: 'register',      label: 'Register Your Agent',    icon: UserPlus  },
  { id: 'trust-score',   label: 'Trust Score System',     icon: Shield    },
  { id: 'erc8004',       label: 'ERC-8004 Registry',      icon: Layers    },
  { id: 'metadata',      label: 'Agent Metadata',         icon: Cpu       },
  { id: 'api',           label: 'API Reference',          icon: FileCode2 },
];

// ── Page ───────────────────────────────────────────────────────────────────

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">

      {/* Page header */}
      <div className="mb-8">
        <div className={cn(
          'mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1',
          'border-[rgba(74,222,128,0.2)] bg-[rgba(74,222,128,0.06)]',
        )}>
          <BookOpen className="h-3 w-3 text-primary" />
          <span className="text-[11px] font-medium uppercase tracking-wider text-primary">Documentation</span>
        </div>
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-white">Enigma Docs</h1>
        <p className="max-w-xl text-sm text-[#64748B]">
          The trust and reputation layer for autonomous AI agents on Avalanche.
          Learn how scores are calculated, how the registry works, and how to use the API.
        </p>
      </div>

      {/* Mobile TOC — horizontal scroll, visible below lg */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
        {toc.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={cn(
              'flex flex-shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors',
              'border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-[#64748B]',
              'hover:border-[rgba(74,222,128,0.2)] hover:text-white',
            )}
          >
            {item.label}
          </a>
        ))}
      </div>

      <div className="flex gap-8">

        {/* ── Left: sticky TOC ───────────────────────────────────────── */}
        <aside data-tour="docs-toc" className="hidden w-52 flex-shrink-0 lg:block">
          <div className="sticky top-6">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[#475569]">
              On this page
            </p>
            <nav className="space-y-0.5">
              {toc.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={cn(
                      'group flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors',
                      'text-[#64748B] hover:bg-[rgba(255,255,255,0.04)] hover:text-white',
                    )}
                  >
                    <Icon className="h-3.5 w-3.5 flex-shrink-0 text-[#334155] group-hover:text-[#475569]" />
                    {item.label}
                  </a>
                );
              })}
            </nav>

            <div className="mt-6 border-t border-[rgba(255,255,255,0.05)] pt-5">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#475569]">Resources</p>
              <Link
                href="/docs/api"
                className="flex items-center gap-1.5 text-xs text-[#64748B] hover:text-primary transition-colors"
              >
                <FileCode2 className="h-3 w-3" />
                Full API Reference
                <ChevronRight className="ml-auto h-3 w-3" />
              </Link>
              <a
                href="https://t.me/enigma_avax"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 flex items-center gap-1.5 text-xs text-[#64748B] hover:text-primary transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                Community
              </a>
            </div>
          </div>
        </aside>

        {/* ── Main content ───────────────────────────────────────────── */}
        <main className="min-w-0 flex-1">

          {/* ── Introduction ─────────────────────────────────────── */}
          <SectionHeading id="intro">
            <BookOpen className="h-5 w-5 text-primary" />
            Introduction
          </SectionHeading>

          <Para>
            <strong className="text-white">Enigma</strong> is an on-chain reputation system for autonomous AI agents
            deployed on the Avalanche C-Chain. It indexes agents registered under the{' '}
            <strong className="text-white">ERC-8004</strong> standard, computes a deterministic trust score for each
            one, and exposes the data through a REST API and a visual scanner interface.
          </Para>
          <Para>
            Every agent gets a score from <Code>0</Code> to <Code>100</Code> based on five weighted signals:
            on-chain verification, community ratings, activity history, report history, and longevity.
            Scores are recalculated automatically every <strong className="text-white">3 hours</strong>.
          </Para>

          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { label: 'Agents indexed', value: 'Live', color: '#4ADE80' },
              { label: 'Score refresh', value: '3 h',  color: '#22D3EE' },
              { label: 'Network',        value: 'Avalanche C-Chain', color: '#A78BFA' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-4"
              >
                <p className="font-mono text-lg font-bold" style={{ color: stat.color }}>{stat.value}</p>
                <p className="text-xs text-[#64748B]">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* ── Quick Start ───────────────────────────────────────── */}
          <SectionHeading id="quickstart">
            <ArrowRight className="h-5 w-5 text-[#22D3EE]" />
            Quick Start
          </SectionHeading>

          <SubHeading>1. Browse the Scanner</SubHeading>
          <Para>
            Go to <Link href="/scanner/agents" className="text-primary underline underline-offset-2 hover:opacity-80">/scanner/agents</Link> to
            see all indexed agents. Use the filters on the right to narrow by type, status, or minimum trust score.
            Click any row to open the agent profile.
          </Para>

          <SubHeading>2. Read an Agent Profile</SubHeading>
          <Para>
            Each agent profile shows: identity (name, address, avatar), trust score with a trend sparkline,
            full metadata from the on-chain <Code>tokenURI</Code>, and a trust history chart.
            The <strong className="text-white">Trust Graph</strong> tab shows relationships with other agents.
          </Para>

          <SubHeading>3. Use the API</SubHeading>
          <Para>
            All data is available via REST. No API key is needed for read-only access.
          </Para>
          <CodeBlock lang="bash">{`# List top agents by trust score
curl https://enigma.avax.network/api/v1/agents?sortBy=trust_score&sortOrder=desc&limit=10

# Get a specific agent
curl https://enigma.avax.network/api/v1/agents/0xABCDEF…`}</CodeBlock>

          <Callout type="info">
            The API base URL is <Code>/api/v1</Code>. All responses follow the shape{' '}
            <Code>{'{ data, error, meta }'}</Code>. See the{' '}
            <Link href="/docs/api" className="text-[#22D3EE] underline underline-offset-2">full API reference</Link> for
            all endpoints and parameters.
          </Callout>

          {/* ── Register Your Agent ───────────────────────────────── */}
          <SectionHeading id="register">
            <UserPlus className="h-5 w-5 text-[#A78BFA]" />
            Register Your Agent
          </SectionHeading>

          <Para>
            Ready to get your AI agent on-chain? Follow these steps to register your agent on the
            Enigma platform and start building trust with the community.
          </Para>

          <SubHeading>Step 1: Prepare Your Metadata</SubHeading>
          <Para>
            Create a JSON file with your agent&apos;s metadata. Host it on a publicly accessible URL
            (IPFS, your own server, or any CDN). This will be your <Code>tokenURI</Code>.
          </Para>
          <CodeBlock lang="json">{`{
  "name": "My Awesome Agent",
  "description": "An AI agent that helps with trading strategies.",
  "image": "https://your-domain.com/agent-avatar.png",
  "type": "TRADING",
  "services": [
    { "name": "mcp", "endpoint": "https://your-domain.com/mcp" },
    { "name": "a2a", "endpoint": "https://your-domain.com/a2a" }
  ]
}`}</CodeBlock>

          <SubHeading>Step 2: Connect Your Wallet</SubHeading>
          <Para>
            Go to the <Link href="/register" className="text-primary underline underline-offset-2 hover:opacity-80">Register page</Link> and
            connect your wallet. You&apos;ll need some AVAX for the transaction gas fee.
          </Para>

          <SubHeading>Step 3: Submit Registration</SubHeading>
          <Para>
            Enter your agent&apos;s contract address and metadata URI, select the agent type, and submit
            the transaction. The registration will be processed on-chain immediately.
          </Para>

          <SubHeading>Step 4: Wait for Indexing</SubHeading>
          <Para>
            Enigma&apos;s indexer runs every <strong className="text-white">3 hours</strong>. Once your agent
            is indexed, it will appear in the scanner with a <Code>PENDING</Code> status. The trust score
            will be calculated in the next cycle.
          </Para>

          <Callout type="success">
            After registration, your agent will automatically receive trust score updates based on
            on-chain activity, community ratings, and verification status.
          </Callout>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/register"
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold',
                'border border-[rgba(74,222,128,0.3)] bg-[rgba(74,222,128,0.1)] text-[#4ADE80]',
                'hover:bg-[rgba(74,222,128,0.15)] hover:border-[rgba(74,222,128,0.4)] transition-all',
              )}
            >
              <UserPlus className="h-3.5 w-3.5" />
              Register Now
              <ArrowRight className="h-3 w-3" />
            </Link>
            <Link
              href="/scanner/agents"
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold',
                'border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[#94A3B8]',
                'hover:bg-[rgba(255,255,255,0.08)] hover:text-white transition-all',
              )}
            >
              Browse Registered Agents
            </Link>
          </div>

          {/* ── Trust Score ───────────────────────────────────────── */}
          <div data-tour="docs-trust">
          <SectionHeading id="trust-score">
            <Shield className="h-5 w-5 text-primary" />
            Trust Score System
          </SectionHeading>

          <Para>
            The trust score is a weighted aggregate of five independent signals, each normalized to a
            0–100 range before weighting. The final score is always an integer between <Code>0</Code> and <Code>100</Code>.
          </Para>

          <div className="mb-6 space-y-3 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-5">
            <ScoreRow label="Verification Status"    pct={30} color="#4ADE80" />
            <ScoreRow label="Community Ratings"      pct={25} color="#22D3EE" />
            <ScoreRow label="On-chain Activity"      pct={20} color="#FCD34D" />
            <ScoreRow label="Report History"         pct={15} color="#FB7185" />
            <ScoreRow label="Time Factor (longevity)" pct={10} color="#A78BFA" />
          </div>

          <SubHeading>Score Tiers</SubHeading>
          <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { range: '80–100', label: 'High Trust',   color: '#4ADE80', bg: 'rgba(74,222,128,0.08)'  },
              { range: '60–79',  label: 'Moderate',     color: '#22D3EE', bg: 'rgba(34,211,238,0.08)'  },
              { range: '40–59',  label: 'Low Trust',    color: '#FCD34D', bg: 'rgba(252,211,77,0.08)'  },
              { range: '0–39',   label: 'Critical',     color: '#FB7185', bg: 'rgba(251,113,133,0.08)' },
            ].map((tier) => (
              <div
                key={tier.range}
                className="flex flex-col items-center rounded-xl border p-3 text-center"
                style={{ borderColor: `${tier.color}30`, background: tier.bg }}
              >
                <span className="font-mono text-lg font-bold" style={{ color: tier.color }}>{tier.range}</span>
                <span className="text-[11px] text-[#94A3B8]">{tier.label}</span>
              </div>
            ))}
          </div>

          <SubHeading>Agent Statuses</SubHeading>
          <Para>
            Status is separate from the numeric score. An agent can have a high score and still be{' '}
            <Code>FLAGGED</Code> if a manual review is pending.
          </Para>
          <div className="mb-6 space-y-1.5">
            {[
              { status: 'VERIFIED',  desc: 'Identity confirmed, tokenURI resolves, no open reports.', color: '#4ADE80' },
              { status: 'PENDING',   desc: 'Newly registered. Awaiting first indexer cycle.',          color: '#FCD34D' },
              { status: 'FLAGGED',   desc: 'Under community review. Score still calculated.',          color: '#FB7185' },
              { status: 'SUSPENDED', desc: 'Removed from active registry by governance.',              color: '#FB7185' },
            ].map((s) => (
              <div key={s.status} className="flex items-start gap-3 rounded-lg border border-[rgba(255,255,255,0.06)] px-3 py-2.5">
                <span
                  className="mt-0.5 shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold"
                  style={{ background: `${s.color}14`, color: s.color }}
                >
                  {s.status}
                </span>
                <span className="text-xs text-[#94A3B8]">{s.desc}</span>
              </div>
            ))}
          </div>

          </div>

          {/* ── ERC-8004 ──────────────────────────────────────────── */}
          <SectionHeading id="erc8004">
            <Layers className="h-5 w-5 text-[#22D3EE]" />
            ERC-8004 Agent Registry
          </SectionHeading>

          <Para>
            ERC-8004 is a token standard for registering autonomous AI agents on EVM chains.
            Each agent is minted as an NFT on the <strong className="text-white">Avalanche C-Chain</strong> registry
            contract. The token&apos;s <Code>tokenURI</Code> resolves to a JSON blob describing the agent&apos;s
            identity, services, and capabilities.
          </Para>

          <Callout type="success">
            Enigma listens to <Code>Transfer</Code> events on the registry contract and automatically
            indexes any newly minted agent within the next indexer cycle (up to 3 hours).
          </Callout>

          <SubHeading>Registering an Agent</SubHeading>
          <Para>
            Call <Code>register(tokenURI)</Code> on the ERC-8004 registry contract with your agent&apos;s
            metadata URI. The URI should point to a publicly accessible JSON document that follows the
            metadata schema described in the next section. Once indexed, your agent will appear in the
            scanner with a <Code>PENDING</Code> status until the trust score is calculated.
          </Para>

          <CodeBlock lang="solidity">{`// Minimal ERC-8004 registration (Solidity)
IAgentRegistry registry = IAgentRegistry(0x...);
string memory uri = "https://your-agent.example.com/metadata.json";
uint256 tokenId = registry.register(uri);`}</CodeBlock>

          {/* ── Agent Metadata ───────────────────────────────────── */}
          <SectionHeading id="metadata">
            <Cpu className="h-5 w-5 text-[#FCD34D]" />
            Agent Metadata
          </SectionHeading>

          <Para>
            When the indexer fetches a <Code>tokenURI</Code>, it expects a JSON object with the following structure.
            All fields are optional except <Code>name</Code>.
          </Para>

          <CodeBlock lang="json">{`{
  "name": "My Agent",
  "description": "Brief description of what this agent does.",
  "image": "https://…/avatar.png",
  "type": "TRADING",
  "services": [
    { "name": "mcp",  "endpoint": "https://…/mcp",  "version": "1.0" },
    { "name": "a2a",  "endpoint": "https://…/a2a" },
    { "name": "web",  "endpoint": "https://…" },
    { "name": "oasf", "endpoint": "https://…/oasf" }
  ],
  "x402Support": true,
  "active": true,
  "supportedTrust": ["eip-7702", "erc-8004"],
  "registrations": [
    { "agentId": 1, "agentRegistry": "0x…" }
  ]
}`}</CodeBlock>

          <SubHeading>Service Tags</SubHeading>
          <Para>
            The <Code>services[].name</Code> field drives the colored badges shown in the scanner.
            Recognized values:
          </Para>
          <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { tag: 'mcp',  desc: 'Model Context Protocol', color: '#4ADE80' },
              { tag: 'a2a',  desc: 'Agent-to-Agent',         color: '#FCD34D' },
              { tag: 'web',  desc: 'Web / HTTP endpoint',     color: '#22D3EE' },
              { tag: 'oasf', desc: 'Open Agent Standard',     color: '#A78BFA' },
            ].map((s) => (
              <div
                key={s.tag}
                className="rounded-xl border p-3"
                style={{ borderColor: `${s.color}25`, background: `${s.color}0a` }}
              >
                <span className="font-mono text-sm font-bold" style={{ color: s.color }}>{s.tag}</span>
                <p className="mt-0.5 text-[11px] text-[#64748B]">{s.desc}</p>
              </div>
            ))}
          </div>

          <Callout type="warn">
            The <Code>image</Code> URL must be publicly reachable. Enigma does not cache images — the
            browser fetches them directly from your server. Use HTTPS and CORS-permissive headers.
          </Callout>

          {/* ── API ───────────────────────────────────────────────── */}
          <div data-tour="docs-api">
          <SectionHeading id="api">
            <FileCode2 className="h-5 w-5 text-[#22D3EE]" />
            API Reference
          </SectionHeading>

          <Para>
            The Enigma REST API is available at <Code>/api/v1</Code>. No authentication is required
            for read endpoints. All responses use the envelope format below.
          </Para>

          <CodeBlock lang="json">{`// Success
{ "data": { … }, "error": null, "meta": { "page": 1, "total": 42, … } }

// Error
{ "data": null, "error": { "message": "Not found", "code": "NOT_FOUND" } }`}</CodeBlock>

          <SubHeading>Core Endpoints</SubHeading>
          <div className="mb-6 space-y-2">
            {[
              {
                method: 'GET',
                path: '/api/v1/agents',
                desc: 'List all agents. Supports: type, status, minTrustScore, search, sortBy, sortOrder, page, limit.',
                color: '#4ADE80',
              },
              {
                method: 'GET',
                path: '/api/v1/agents/:address',
                desc: 'Full agent profile including metadata, trust breakdown, and recent activity.',
                color: '#4ADE80',
              },
              {
                method: 'GET',
                path: '/api/v1/agents/:address/trust-history',
                desc: 'Historical trust score data for charting (30 day window by default).',
                color: '#4ADE80',
              },
              {
                method: 'GET',
                path: '/api/v1/agents/sparklines',
                desc: 'Batch sparkline data for multiple agents. Pass addresses[] in query string.',
                color: '#4ADE80',
              },
              {
                method: 'GET',
                path: '/api/v1/agents/activity',
                desc: 'Recent on-chain activity events across all agents.',
                color: '#4ADE80',
              },
            ].map((ep) => (
              <div
                key={ep.path}
                className="flex flex-col gap-1 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] px-4 py-3 sm:flex-row sm:items-start sm:gap-3"
              >
                <span
                  className="shrink-0 rounded px-2 py-0.5 font-mono text-[10px] font-bold"
                  style={{ background: `${ep.color}14`, color: ep.color }}
                >
                  {ep.method}
                </span>
                <div>
                  <code className="font-mono text-[12px] text-white">{ep.path}</code>
                  <p className="mt-0.5 text-xs text-[#64748B]">{ep.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/docs/api"
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold',
                'border border-[rgba(34,211,238,0.25)] bg-[rgba(34,211,238,0.08)] text-[#22D3EE]',
                'hover:bg-[rgba(34,211,238,0.14)] transition-all',
              )}
            >
              Full API Reference
              <ArrowRight className="h-3 w-3" />
            </Link>
            <a
              href="https://t.me/enigma_avax"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold',
                'border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[#94A3B8]',
                'hover:bg-[rgba(255,255,255,0.08)] hover:text-white transition-all',
              )}
            >
              <ExternalLink className="h-3 w-3" />
              Community
            </a>
          </div>
          </div>

        </main>
      </div>
    </div>
  );
}
