'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  GitBranch,
  TerminalSquare,
  Activity,
  Zap,
  Rocket,
  Search,
  Eye,
  Settings,
  ShieldCheck,
  Globe,
  Database,
  Code2,
  Lock,
  Heart,
  ActivitySquare,
  Stethoscope,
  Users,
  BarChart4
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FlashlightCursor } from '@/components/shared/flashlight-cursor';
import { IndustrialCorner } from '@/components/shared/industrial-corner';

// ── Shared Primitives (Neo-Precisión) ──────────────────────────────────────────────

function SectionHeading({ icon: Icon, children }: { icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div className="group relative mb-8 animate-fade-in-up">
      <h2 className="flex items-center gap-4 text-3xl font-black uppercase tracking-tighter text-white">
        <div className="flex h-12 w-12 items-center justify-center border border-[#4ADE80]/20 bg-[#4ADE80]/5">
          <Icon className="h-6 w-6 text-[#4ADE80]" />
        </div>
        {children}
      </h2>
      <div className="mt-4 h-px w-full bg-gradient-to-r from-[#4ADE80]/20 via-[#4ADE80]/10 to-transparent" />
    </div>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 mt-12 text-[12px] font-black uppercase tracking-[0.4em] text-[#4ADE80]">
      {children}
    </h3>
  );
}

function Para({ children }: { children: React.ReactNode }) {
  return <p className="mb-6 text-[15px] font-medium leading-[1.8] text-[#64748B] tracking-wide">{children}</p>;
}

function Code({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <code className={cn("rounded-none border border-[#4ADE80]/20 bg-[#4ADE80]/5 px-2 py-0.5 font-mono text-[12px] font-bold text-[#4ADE80]", className)}>
      {children}
    </code>
  );
}

function CodeBlock({ children, lang = 'bash' }: { children: string; lang?: string }) {
  return (
    <div className="relative mb-8 overflow-hidden rounded-none border border-[#4ADE80]/10 bg-[#05070A]/90 shadow-2xl group">
      <div className="flex items-center justify-between border-b border-[#4ADE80]/10 px-5 py-3 bg-[#4ADE80]/[0.02]">
        <div className="flex items-center gap-3">
          <TerminalSquare className="h-4 w-4 text-[#4ADE80]/60" />
          <span className="font-mono text-[11px] font-black uppercase tracking-widest text-[#475569]">
            EXEC_SEQUENCE::{lang}
          </span>
        </div>
        <div className="flex gap-2 text-[#4ADE80]/20 text-[10px] font-mono">STATUS::OK</div>
      </div>
      <pre className="overflow-x-auto p-8 scrollbar-thin scrollbar-thumb-[#4ADE80]/20">
        <code className="font-mono text-[13px] leading-relaxed text-[#94A3B8]">{children}</code>
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
    info:    { icon: Info,          border: 'border-[#22D3EE]/30', bg: 'bg-[#22D3EE]/5',  text: 'text-[#22D3EE]' },
    warn:    { icon: AlertTriangle, border: 'border-red-500/30',     bg: 'bg-red-500/5',      text: 'text-red-400' },
    success: { icon: CheckCircle2,  border: 'border-[#4ADE80]/30', bg: 'bg-[#4ADE80]/5', text: 'text-[#4ADE80]'  },
  };
  const s = styles[type];
  const Icon = s.icon;
  return (
    <div className={cn('relative mb-10 flex gap-6 border p-8 rounded-none overflow-hidden backdrop-blur-md', s.border, s.bg)}>
      <div className={cn("absolute left-0 top-0 bottom-0 w-1", s.text.replace('text-', 'bg-'))} />
      <Icon className={cn('mt-0.5 h-6 w-6 shrink-0', s.text)} />
      <div className="text-[14px] font-medium leading-relaxed text-[#94A3B8] tracking-wide">{children}</div>
    </div>
  );
}

function ScoreRow({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div className="flex items-center gap-5 p-4 border-b border-[#4ADE80]/10 last:border-0 hover:bg-[#4ADE80]/5 transition-colors group">
      <span className="w-56 text-[11px] font-black text-[#64748B] uppercase tracking-widest">{label}</span>
      <div className="h-2 flex-1 relative bg-[#05070A]/80 border border-[#4ADE80]/10 overflow-hidden">
        <div 
          className="h-full transition-all duration-1000 group-hover:brightness-125" 
          style={{ width: `${pct}%`, backgroundColor: color, boxShadow: `0 0 10px ${color}40` }} 
        />
      </div>
      <span className="w-12 text-right font-mono text-xs font-black text-white">{pct}%</span>
    </div>
  );
}

function EndpointBlock({ 
  method, 
  path, 
  desc, 
  auth = false, 
  children 
}: { 
  method: 'GET' | 'POST'; 
  path: string; 
  desc: string; 
  auth?: boolean;
  children?: React.ReactNode;
}) {
  const isPost = method === 'POST';
  return (
    <div className={cn(
      "border p-8 mb-12 shadow-2xl relative overflow-hidden group transition-all",
      isPost ? "border-red-500/20 bg-red-500/[0.02]" : "border-[#4ADE80]/10 bg-[#0F1219]/40"
    )}>
       <div className="absolute top-0 right-0 p-4 opacity-5 font-mono text-[60px] font-black uppercase select-none">{method}</div>
       <div className="flex items-center gap-4 mb-6">
          <span className={cn(
            "px-3 py-1 font-mono text-[11px] font-black",
            isPost ? "bg-red-500/20 text-red-400" : "bg-[#4ADE80]/10 text-[#4ADE80]"
          )}>{method}</span>
          <code className="text-xl font-black font-mono text-white tracking-tighter">{path}</code>
          {auth && <Lock className="h-4 w-4 text-red-500/60" />}
       </div>
       <p className="mb-8 text-[14px] font-medium text-[#64748B] uppercase tracking-tight">{desc}</p>
       {children}
    </div>
  );
}

function ParamTable({ params }: { params: string[][] }) {
  return (
    <div className="mb-8 overflow-hidden border border-white/5 bg-[#05070A]/60">
      <div className="grid grid-cols-[140px_100px_80px_1fr] p-3 text-[10px] font-black uppercase tracking-widest text-[#475569] border-b border-white/5 bg-white/[0.02]">
         <span>Param</span>
         <span>Type</span>
         <span>Req</span>
         <span>Description</span>
      </div>
      <div className="flex flex-col">
        {params.map(([name, type, req, desc]) => (
          <div key={name} className="grid grid-cols-[140px_100px_80px_1fr] p-4 text-[11px] items-center border-b border-white/5 last:border-0 hover:bg-[#4ADE80]/5 transition-colors">
             <span className="font-black text-[#4ADE80] font-mono">{name}</span>
             <span className="font-mono text-[#64748B] text-[10px]">{type}</span>
             <span className="text-[10px] font-black text-[#475569]">{req}</span>
             <span className="text-white/60 font-medium tracking-tight leading-relaxed">{desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Section Components ─────────────────────────────────────────────────────────────

function IntroSection() {
  return (
    <div className="animate-fade-in pb-12">
      <SectionHeading icon={BookOpen}>Introduction</SectionHeading>
      <Para>
        FLARE is an on-chain reputation system for autonomous AI agents deployed on Avalanche. 
        It indexes agents registered under the ERC-8004 standard, computes a deterministic trust score for each one, 
        and exposes the data through a REST API and a visual scanner interface.
      </Para>
      <Para>
        Every agent gets a score from 0 to 100 based on five weighted signals: on-chain verification, 
        community ratings, activity history, report history, and longevity. Scores are recalculated automatically every 3 hours.
      </Para>
      
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Agents indexed', value: 'Live', color: '#4ADE80' },
          { label: 'Score refresh', value: '3 h', color: '#22D3EE' },
          { label: 'Network', value: 'AVALANCHE', color: '#FFFFFF', icon: '/avalanche-logo.webp' },
        ].map((stat) => (
          <div key={stat.label} className="border border-[#4ADE80]/10 bg-[#0F1219]/40 p-8 relative group hover:border-[#4ADE80]/40 transition-all flex flex-col justify-between h-full">
            <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="font-mono text-[24px] font-black" style={{ color: stat.color }}>{stat.value}</p>
                </div>
              <p className="text-[10px] text-[#475569] font-black uppercase tracking-[0.2em]">{stat.label}</p>
            </div>
          </div>
        ))}
        
      </div>
    </div>
  );
}

function QuickStartSection() {
  return (
    <div className="animate-fade-in pb-12">
      <SectionHeading icon={Rocket}>Quick Start</SectionHeading>
      
      <div className="space-y-16 mt-12">
        <div className="relative pl-12 border-l border-[#4ADE80]/10 group">
           <div className="absolute -left-[5px] top-4 h-2 w-2 bg-[#4ADE80]" />
           <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4">1. Browse the Scanner</h3>
           <Para>
            Go to <Link href="/scanner/agents" className="text-[#4ADE80] border-b border-[#4ADE80]/20 hover:border-[#4ADE80] transition-colors">/scanner/agents</Link> to see all indexed agents. 
            Use the filters on the right to narrow by type, status, or minimum trust score. Click any row to open the agent profile.
           </Para>
        </div>

        <div className="relative pl-12 border-l border-[#4ADE80]/10 group">
           <div className="absolute -left-[5px] top-4 h-2 w-2 bg-[#4ADE80]/40" />
           <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4">2. Read an Agent Profile</h3>
           <Para>
             Each agent profile shows: identity (name, address, avatar), trust score with a trend sparkline, 
             full metadata from the on-chain <Code>tokenURI</Code>, and a trust history chart. 
             The <strong className="text-white">Trust Graph</strong> tab shows relationships with other agents.
           </Para>
        </div>

        <div className="relative pl-12 border-l border-[#4ADE80]/10 group">
           <div className="absolute -left-[5px] top-4 h-2 w-2 bg-[#4ADE80]/10" />
           <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4">3. Use the API</h3>
           <Para>All data is available via REST. No API key is needed for read-only access.</Para>
           <CodeBlock lang="bash">{`# List top agents by trust score
curl https://flare.avax.network/api/v1/agents?sortBy=trust_score&sortOrder=desc&limit=10

# Get a specific agent
curl https://flare.avax.network/api/v1/agents/0xABCDEF…`}</CodeBlock>
           <Para>The API base URL is <Code>/api/v1</Code>. All responses follow the shape <Code>{'{ data, error, meta }'}</Code>.</Para>
        </div>
      </div>
    </div>
  );
}

function RegisterSection() {
  return (
    <div className="animate-fade-in pb-12">
      <SectionHeading icon={UserPlus}>Register Your Agent</SectionHeading>
      <Para>Ready to get your AI agent on-chain? Follow these steps to register your agent on the FLARE platform and start building trust with the community.</Para>

      <div className="space-y-12 mt-12 mb-16">
        {[
          { id: '1', title: 'Prepare Your Metadata', desc: 'Create a JSON file with your agent\'s metadata. Host it on a publicly accessible URL (IPFS, your own server, or any CDN). This will be your tokenURI.' },
          { id: '2', title: 'Connect Your Wallet', desc: 'Go to the Register page and connect your wallet. You\'ll need some AVAX for the transaction gas fee.' },
          { id: '3', title: 'Submit Registration', desc: 'Enter your agent\'s contract address and metadata URI, select the agent type, and submit the transaction. The registration will be processed on-chain immediately.' },
          { id: '4', title: 'Wait for Indexing', desc: 'FLARE\'s indexer runs every 3 hours. Once indexed, it will appear in the scanner with a PENDING status. The trust score will be calculated in the next cycle.' },
        ].map((step) => (
          <div key={step.id} className="relative pl-16 group">
             <div className="absolute left-0 top-0 h-10 w-10 flex items-center justify-center bg-[#4ADE80]/10 border border-[#4ADE80]/20 font-black text-xs text-[#4ADE80]">0{step.id}</div>
             <h4 className="text-[12px] font-black text-white uppercase tracking-widest mb-2">Step {step.id}: {step.title}</h4>
             <p className="text-xs text-[#64748B] leading-relaxed uppercase opacity-80">{step.desc}</p>
          </div>
        ))}
      </div>

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

      <Para>After registration, your agent will automatically receive trust score updates based on on-chain activity, community ratings, and verification status.</Para>

      <div className="flex flex-wrap gap-4 pt-10 mt-10 border-t border-[#4ADE80]/10">
         <Link href="/register" className="h-12 px-10 bg-[#4ADE80] text-[#05070A] font-black uppercase tracking-widest text-[11px] flex items-center justify-center hover:bg-[#22D3EE] transition-all">Register Now</Link>
         <Link href="/scanner/agents" className="h-12 px-10 border border-[#4ADE80]/20 text-white font-black uppercase tracking-widest text-[11px] flex items-center justify-center hover:bg-[#4ADE80]/10 transition-all">Browse Registered Agents</Link>
      </div>
    </div>
  );
}

function TrustSection() {
  return (
    <div className="animate-fade-in pb-12">
      <SectionHeading icon={Shield}>Trust Score System</SectionHeading>
      <Para>The trust score is a weighted aggregate of five independent signals, each normalized to a 0–100 range before weighting. The final score is always an integer between 0 and 100.</Para>

      <div className="border border-[#4ADE80]/20 bg-[#05070A]/80 shadow-2xl mb-12">
        <div className="flex flex-col">
          <ScoreRow label="Verification Status"    pct={30} color="#4ADE80" />
          <ScoreRow label="Community Ratings"      pct={25} color="#22D3EE" />
          <ScoreRow label="On-chain Activity"      pct={20} color="#FCD34D" />
          <ScoreRow label="Report History"         pct={15} color="#FB7185" />
          <ScoreRow label="Time Factor (longevity)" pct={10} color="#A78BFA" />
        </div>
      </div>

      <SubHeading>Score Tiers</SubHeading>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { range: '80–100', tier: 'High Trust', color: '#4ADE80' },
          { range: '60–79',  tier: 'Moderate',   color: '#22D3EE' },
          { range: '40–59',  tier: 'Low Trust',   color: '#FCD34D' },
          { range: '0–39',   tier: 'Critical',   color: '#FB7185' },
        ].map((t) => (
          <div key={t.tier} className="p-6 border border-white/5 bg-[#0F1219]/40 text-center">
             <p className="font-mono text-2xl font-black mb-1" style={{ color: t.color }}>{t.range}</p>
             <p className="text-[10px] font-black text-[#475569] uppercase tracking-widest">{t.tier}</p>
          </div>
        ))}
      </div>

      <SubHeading>Agent Statuses</SubHeading>
      <Para>Status is separate from the numeric score. An agent can have a high score and still be FLAGGED if a manual review is pending.</Para>
      <div className="space-y-4">
        {[
          { stat: 'VERIFIED', desc: 'Identity confirmed, tokenURI resolves, no open reports.', color: '#4ADE80' },
          { stat: 'PENDING',  desc: 'Newly registered. Awaiting first indexer cycle.', color: '#FCD34D' },
          { stat: 'FLAGGED',  desc: 'Under community review. Score still calculated.', color: '#FB7185' },
          { stat: 'SUSPENDED', desc: 'Removed from active registry by governance.', color: '#FB7185' },
        ].map((s) => (
          <div key={s.stat} className="flex items-start gap-8 p-5 border border-white/5 bg-[#05070A]/40 relative group">
             <div className="absolute left-0 top-0 bottom-0 w-1 transition-all" style={{ backgroundColor: s.color }} />
             <span className="w-28 text-[11px] font-black uppercase tracking-widest mt-1" style={{ color: s.color }}>{s.stat}</span>
             <p className="text-xs text-[#64748B] font-medium uppercase tracking-tight leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ERC8004Section() {
  return (
    <div className="animate-fade-in pb-12">
      <SectionHeading icon={Layers}>ERC-8004 Agent Registry</SectionHeading>
      <Para>ERC-8004 is a token standard for registering autonomous AI agents on EVM chains. Each agent is minted as an NFT on the Avalanche C-Chain registry contract. The token&apos;s <Code>tokenURI</Code> resolves to a JSON blob describing the agent&apos;s identity, services, and capabilities.</Para>
      
      <Para>FLARE listens to Transfer events on the registry contract and automatically indexes any newly minted agent within the next indexer cycle (up to 3 hours).</Para>

      <SubHeading>Registering an Agent</SubHeading>
      <Para>Call <Code>register(tokenURI)</Code> on the ERC-8004 registry contract with your agent&apos;s metadata URI. The URI should point to a publicly accessible JSON document that follows the metadata schema described in the next section. Once indexed, your agent will appear in the scanner with a PENDING status until the trust score is calculated.</Para>
      
      <CodeBlock lang="solidity">{`// Minimal ERC-8004 registration (Solidity)
IAgentRegistry registry = IAgentRegistry(0x...);
string memory uri = "https://your-agent.example.com/metadata.json";
uint256 tokenId = registry.register(uri);`}</CodeBlock>
    </div>
  );
}

function MetadataSection() {
  return (
    <div className="animate-fade-in pb-12">
      <SectionHeading icon={Cpu}>Agent Metadata</SectionHeading>
      <Para>When the indexer fetches a <Code>tokenURI</Code>, it expects a JSON object with the following structure. All fields are optional except <Code>name</Code>.</Para>

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
      <Para>The <Code>services[].name</Code> field drives the colored badges shown in the scanner. Recognized values:</Para>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {[
          { id: 'mcp', label: 'Model Context Protocol' },
          { id: 'a2a', label: 'Agent-to-Agent' },
          { id: 'web', label: 'Web / HTTP endpoint' },
          { id: 'oasf', label: 'Open Agent Standard' },
        ].map(s => (
          <div key={s.id} className="p-4 border border-white/5 bg-[#0F1219]/40 flex items-center gap-4">
             <span className="px-2 py-0.5 bg-[#4ADE80]/10 text-[#4ADE80] font-mono text-[9px] font-black">{s.id}</span>
             <p className="text-[10px] text-[#475569] uppercase font-black">{s.label}</p>
          </div>
        ))}
      </div>

      <Para><span className="italic opacity-80">The image URL must be publicly reachable. FLARE does not cache images — the browser fetches them directly from your server. Use HTTPS and CORS-permissive headers.</span></Para>
    </div>
  );
}

function APISection() {
  return (
    <div className="animate-fade-in pb-12">
      <SectionHeading icon={FileCode2}>API Reference</SectionHeading>
      <Para>All endpoints follow a standard response envelope with data, error, and optional meta fields. Base URL: <Code>https://flare.app</Code></Para>

      <SubHeading>Standard Response Format</SubHeading>
      <CodeBlock lang="json">{`{
  "data":  { … } | null,
  "error": null   | { "message": "…", "code": "…", "fields": { … } },
  "meta":  { "page": 1, "limit": 20, "total": 1693, "totalPages": 85 }
}`}</CodeBlock>

      {/* Agents Section */}
      <div className="mt-16 border-t border-white/5 pt-12">
         <div className="flex items-center gap-4 mb-8">
            <UsersIcon className="h-6 w-6 text-[#4ADE80]" />
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Agents</h3>
         </div>
         <Para>List, search, and retrieve agent profiles from the on-chain registry.</Para>

         <EndpointBlock 
           method="GET" 
           path="/api/v1/agents" 
           desc="List all agents with optional filters, sorting, and pagination."
         >
           <h5 className="text-[10px] font-black uppercase tracking-widest text-[#4ADE80]/60 mb-4">Parameters</h5>
           <ParamTable params={[
             ['type', 'string', 'No', 'Filter by agent type (e.g. MCP, A2A, WEB)'],
             ['status', 'string', 'No', 'VERIFIED | PENDING | FLAGGED | SUSPENDED'],
             ['minTrustScore', 'number', 'No', 'Minimum trust score (0–100)'],
             ['search', 'string', 'No', 'Full-text search on name and description'],
             ['sortBy', 'string', 'No', 'trust_score | created_at | updated_at'],
             ['sortOrder', 'string', 'No', 'asc | desc (default: desc)'],
             ['page', 'number', 'No', 'Page number (default: 1)'],
             ['limit', 'number', 'No', 'Items per page (default: 20, max: 100)'],
           ]} />
           <CodeBlock lang="json">{`{
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
}`}</CodeBlock>
         </EndpointBlock>

         <EndpointBlock 
           method="GET" 
           path="/api/v1/agents/:address" 
           desc="Get full details for a single agent including services, capabilities, and registrations."
         >
           <CodeBlock lang="json">{`{
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
}`}</CodeBlock>
         </EndpointBlock>

         <EndpointBlock 
           method="GET" 
           path="/api/v1/agents/stats" 
           desc="Aggregated platform statistics: total agents, verified count, active in last 24 h, breakdown by type and status."
         >
           <CodeBlock lang="json">{`{
  "data": {
    "total": 1693,
    "verified": 412,
    "active24h": 38,
    "byStatus": { "VERIFIED": 412, "PENDING": 1201, "FLAGGED": 47, "SUSPENDED": 33 },
    "byType":   { "MCP": 540, "A2A": 320, "WEB": 610, "CUSTOM": 223 }
  },
  "error": null
}`}</CodeBlock>
         </EndpointBlock>

         <EndpointBlock 
           method="GET" 
           path="/api/v1/agents/sparklines" 
           desc="Batch fetch the last 10 trust score snapshots for up to 50 agents (for sparkline charts)."
         >
           <ParamTable params={[
             ['addresses', 'string', 'Yes', 'Comma-separated list of agent addresses (max 50)'],
           ]} />
           <CodeBlock lang="json">{`{
  "data": {
    "0x1a2b3c…": [{ "v": 72 }, { "v": 75 }, { "v": 80 }, { "v": 87 }],
    "0x4d5e6f…": [{ "v": 55 }, { "v": 60 }]
  },
  "error": null
}`}</CodeBlock>
         </EndpointBlock>
      </div>

      {/* Trust Score Section */}
      <div className="mt-16 border-t border-white/5 pt-12">
         <div className="flex items-center gap-4 mb-8">
            <ShieldCheck className="h-6 w-6 text-[#22D3EE]" />
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Trust Score</h3>
         </div>
         <EndpointBlock 
           method="GET" 
           path="/api/v1/agents/:address/trust-score" 
           desc="Full trust score breakdown with individual component scores, weights, and details."
         >
           <CodeBlock lang="json">{`{
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
}`}</CodeBlock>
         </EndpointBlock>
      </div>

      {/* Ratings Section */}
      <div className="mt-16 border-t border-white/5 pt-12">
         <div className="flex items-center gap-4 mb-8">
            <Heart className="h-6 w-6 text-red-500" />
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Ratings</h3>
         </div>
         <EndpointBlock 
           method="GET" 
           path="/api/v1/agents/:address/ratings" 
           desc="Retrieve paginated community ratings for an agent."
         >
           <ParamTable params={[
             ['page', 'number', 'No', 'Page number (default: 1)'],
             ['limit', 'number', 'No', 'Items per page (default: 10)'],
           ]} />
           <CodeBlock lang="json">{`{
  "data": [
    { "id": "…", "score": 5, "comment": "Great agent!", "rater_address": "0x…", "created_at": "…" }
  ],
  "error": null,
  "meta": { "page": 1, "limit": 10, "total": 42, "totalPages": 5 }
}`}</CodeBlock>
         </EndpointBlock>

         <EndpointBlock 
           method="POST" 
           path="/api/v1/agents/:address/ratings" 
           desc="Submit a community rating (1–5) for an agent. Requires a connected wallet."
           auth
         >
           <ParamTable params={[
             ['score', 'number', 'Yes', 'Rating from 1 to 5'],
             ['comment', 'string', 'No', 'Optional text comment (max 500 chars)'],
             ['wallet', 'string', 'Yes', 'Connected wallet address'],
           ]} />
           <CodeBlock lang="json">{`{
  "data": { "id": "…", "score": 5, "comment": "Great agent!", "created_at": "…" },
  "error": null
}`}</CodeBlock>
         </EndpointBlock>
      </div>

      {/* Reports Section */}
      <div className="mt-16 border-t border-white/5 pt-12">
         <div className="flex items-center gap-4 mb-8">
            <ActivitySquare className="h-6 w-6 text-[#FB7185]" />
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Reports</h3>
         </div>
         <EndpointBlock 
           method="POST" 
           path="/api/v1/agents/:address/reports" 
           desc="Report an agent with a reason and optional description. Requires a connected wallet."
           auth
         >
           <ParamTable params={[
             ['reason', 'string', 'Yes', 'SPAM | SCAM | MALICIOUS | OTHER'],
             ['description', 'string', 'No', 'Additional details (max 1000 chars)'],
             ['wallet', 'string', 'Yes', 'Connected wallet address'],
           ]} />
           <CodeBlock lang="json">{`{
  "data": { "id": "…", "reason": "SCAM", "created_at": "…" },
  "error": null
}`}</CodeBlock>
         </EndpointBlock>
      </div>

      {/* Registration Section */}
      <div className="mt-16 border-t border-white/5 pt-12">
         <div className="flex items-center gap-4 mb-8">
            <UserPlus className="h-6 w-6 text-[#4ADE80]" />
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Registration</h3>
         </div>
         <EndpointBlock 
           method="POST" 
           path="/api/v1/agents/register" 
           desc="Register a new agent on-chain. Triggers ERC-8004 tokenURI resolution and initial trust score calculation."
           auth
         >
           <ParamTable params={[
             ['address', 'string', 'Yes', 'Agent contract address on Avalanche C-Chain'],
             ['name', 'string', 'Yes', 'Human-readable agent name (max 100 chars)'],
             ['description', 'string', 'No', 'Agent description (max 500 chars)'],
             ['type', 'string', 'Yes', 'Agent type: MCP | A2A | WEB | CUSTOM'],
             ['wallet', 'string', 'Yes', 'Owner wallet address'],
           ]} />
           <CodeBlock lang="json">{`{
  "data": {
    "address": "0x1a2b3c…",
    "name": "MyAgent",
    "status": "PENDING",
    "trust_score": 0
  },
  "error": null
}`}</CodeBlock>
         </EndpointBlock>
      </div>

      {/* System Section */}
      <div className="mt-16 border-t border-white/5 pt-12">
         <div className="flex items-center gap-4 mb-8">
            <BarChart4 className="h-6 w-6 text-[#A78BFA]" />
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">System</h3>
         </div>
         <EndpointBlock 
           method="GET" 
           path="/api/v1/health" 
           desc="Health check endpoint. Returns service status and database connectivity."
         >
           <CodeBlock lang="json">{`{
  "data": {
    "status": "ok",
    "database": "connected",
    "timestamp": "2025-06-01T08:30:00Z"
  },
  "error": null
}`}</CodeBlock>
         </EndpointBlock>

         <EndpointBlock 
           method="GET" 
           path="/api/v1/agents/activity" 
           desc="Agent registration and verification activity over time (used by the Activity Chart)."
         >
           <ParamTable params={[
             ['days', 'number', 'No', 'Number of past days to return (default: 30)'],
           ]} />
           <CodeBlock lang="json">{`{
  "data": [
    { "date": "2025-05-31", "registrations": 12, "verifications": 4 },
    { "date": "2025-06-01", "registrations": 7,  "verifications": 2 }
  ],
  "error": null,
  "meta": { "page": 1, "limit": 10, "total": 42, "totalPages": 5 }
}`}</CodeBlock>
         </EndpointBlock>
      </div>
    </div>
  );
}

// ── Icons ──────────────────────────────────────────────────────────────────────────

function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  );
}

// ── Main Page Component ────────────────────────────────────────────────────────────

const TABS = [
  { id: 'intro',         label: 'Introduction',           icon: BookOpen,    component: IntroSection },
  { id: 'quickstart',    label: 'Quick Start',            icon: Rocket,      component: QuickStartSection },
  { id: 'register',      label: 'Register Agent',         icon: UserPlus,    component: RegisterSection },
  { id: 'trust-score',   label: 'Trust System',           icon: Shield,      component: TrustSection },
  { id: 'erc8004',       label: 'ERC-8004 Standard',      icon: Layers,      component: ERC8004Section },
  { id: 'metadata',      label: 'Node Metadata',          icon: Cpu,         component: MetadataSection },
  { id: 'api',           label: 'API Reference',          icon: FileCode2,   component: APISection },
];

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  
  const activeIndex = useMemo(() => TABS.findIndex(t => t.id === activeTab), [activeTab]);
  const ActiveSection = useMemo(() => TABS[activeIndex].component, [activeIndex]);
  const nextSection = TABS[activeIndex + 1];

  const handleSectionChange = (id: string) => {
    setActiveTab(id);
    const mainArea = document.getElementById('main-content-scroll');
    if (mainArea) mainArea.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#05070A] relative overflow-hidden selection:bg-[#4ADE80] selection:text-[#05070A]">
      <FlashlightCursor />

      {/* Hero Header - Thinner (Reduced Padding) */}
      <div className="mx-auto max-w-7xl px-8 pt-12 pb-8 relative z-10 border-b border-[#4ADE80]/10 bg-[#0B0F14]/40 backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-4 mb-3">
              <div className="h-[1px] w-8 bg-[#4ADE80]" />
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#4ADE80]">Technical Documentation</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
              PROTOCOL_<span className="text-[#4ADE80]/30 text-3xl md:text-5xl">DOCS</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-6 pb-1">
             <div className="text-right">
                <p className="text-[9px] font-mono text-[#475569] uppercase tracking-widest mb-0.5">DOC_ID</p>
                <p className="text-md font-black text-white font-mono uppercase">{activeTab}</p>
             </div>
             <div className="h-8 w-px bg-[#4ADE80]/10" />
             <Link href="/scanner" className="h-10 px-5 bg-[#4ADE80] text-[#05070A] font-black uppercase tracking-widest text-[10px] flex items-center justify-center hover:bg-[#22D3EE] transition-all">
                LAUNCH_SYNC
             </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-8 py-12 flex gap-12 relative z-10 h-[calc(100vh-270px)] min-h-[600px] overflow-hidden">
        
        {/* TOC Sidebar */}
        <aside className="hidden w-64 flex-shrink-0 lg:block border-r border-[#4ADE80]/10 pr-8 overflow-y-auto custom-scrollbar">
          <div className="py-2">
            <h4 className="mb-8 text-[11px] font-black uppercase tracking-[0.4em] text-[#475569]">Navigation_Map</h4>
            <nav className="space-y-2">
              {TABS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSectionChange(item.id)}
                  className={cn(
                    'group w-full flex items-center gap-3 px-4 py-3.5 text-[11px] font-black uppercase tracking-widest transition-all duration-300 relative overflow-hidden',
                    activeTab === item.id 
                      ? 'bg-[#4ADE80]/10 text-white' 
                      : 'text-[#64748B] hover:bg-[#4ADE80]/5 hover:text-white',
                  )}
                >
                  <div className={cn(
                    'absolute left-0 top-0 bottom-0 w-[2.5px] bg-[#4ADE80] transition-transform origin-top',
                    activeTab === item.id ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-100'
                  )} />
                  <item.icon className={cn(
                    'h-4 w-4 transition-colors',
                    activeTab === item.id ? 'text-[#4ADE80]' : 'text-[#475569] group-hover:text-[#4ADE80]'
                  )} />
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="mt-12 pt-10 border-t border-[#4ADE80]/10">
              <h4 className="mb-6 text-[11px] font-black uppercase tracking-[0.4em] text-[#475569]">Assets_Host</h4>
              <nav className="space-y-4">
                <a href="#api" onClick={() => handleSectionChange('api')} className="flex items-center justify-between group">
                   <span className="text-[10px] font-black text-[#64748B] group-hover:text-white uppercase tracking-widest transition-colors">FULL_API_RESOURCES</span>
                   <ChevronRight className="h-3.5 w-3.5 text-[#475569] group-hover:text-[#4ADE80] transition-all" />
                </a>
                <a href="https://t.me/flare_avax" target="_blank" className="flex items-center justify-between group">
                   <span className="text-[10px] font-black text-[#64748B] group-hover:text-white uppercase tracking-widest transition-colors">COMMUNITY_UPLINK</span>
                   <ExternalLink className="h-3.5 w-3.5 text-[#475569] group-hover:text-[#4ADE80] transition-all" />
                </a>
              </nav>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main id="main-content-scroll" className="flex-1 min-w-0 overflow-y-auto custom-scrollbar pr-4 pb-20">
          <div className="max-w-4xl py-2">
            <ActiveSection />

            {/* Pagination Footer */}
            {nextSection && (
              <div className="mt-24 pt-16 border-t border-[#4ADE80]/10 flex justify-end animate-fade-in group">
                 <button
                   onClick={() => handleSectionChange(nextSection.id)}
                   className="flex flex-col items-end gap-3 group/btn"
                 >
                   <span className="text-[11px] font-black text-[#4ADE80]/40 uppercase tracking-[0.4em]">Prepare_Next_Sequence</span>
                   <div className="flex items-center gap-6 bg-[#4ADE80]/5 border border-[#4ADE80]/20 px-10 py-6 group-hover/btn:border-[#4ADE80]/60 group-hover/btn:bg-[#4ADE80]/10 transition-all shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
                      <span className="text-2xl font-black text-white uppercase tracking-tighter">{nextSection.label}</span>
                      <ArrowRight className="h-7 w-7 text-[#4ADE80] group-hover/btn:translate-x-2 transition-transform" />
                   </div>
                 </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Decorative vertical mask line */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
    </div>
  );
}
