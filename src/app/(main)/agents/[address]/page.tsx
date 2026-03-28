'use client';

import { useParams } from 'next/navigation';
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  ExternalLink, 
  GitBranch, 
  Bot, 
  BookOpen, 
  Shield, 
  Activity, 
  Users, 
  FileCode2, 
  AlertCircle, 
  Share2, 
  LayoutDashboard, 
  Lock,
  Copy,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { RatingForm } from '@/components/agent/rating-form';
import { ReportModal } from '@/components/agent/report-modal';
import { Spinner } from '@/components/shared/spinner';
import { TourCta } from '@/components/tour';
import { useAgent, type AgentDetail } from '@/hooks/use-agent';
import { cn } from '@/lib/utils';
import { IndustrialCorner } from '@/components/shared/industrial-corner';

// ── Shared Primitives (Neo-Precisión) ──────────────────────────────────────────────

function MetricBadge({ label, value, color = "#4ADE80" }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex flex-col gap-1 px-4 py-2 border-l border-white/5">
       <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#475569]">{label}</span>
       <span className="text-sm font-black text-white font-mono" style={{ color: value === '—' ? '#475569' : 'white' }}>{value}</span>
    </div>
  );
}

function SectionHeading({ title, icon: Icon }: { title: string; icon: any }) {
  return (
    <div className="flex items-center gap-3 mb-8">
       <div className="h-8 w-8 flex items-center justify-center bg-[#4ADE80]/5 border border-[#4ADE80]/10">
          <Icon className="h-4 w-4 text-[#4ADE80]" />
       </div>
       <h3 className="text-sm font-black text-white uppercase tracking-[0.3em]">{title}</h3>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function truncateAddress(address: string): string {
  if (!address) return '0x...';
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

function formatRelativeTime(dateString: string): string {
  try {
    const diffMs = Date.now() - new Date(dateString).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;
    return new Date(dateString).toLocaleDateString();
  } catch {
    return 'unknown';
  }
}

function statusClass(status: string): string {
  if (status === 'VERIFIED') return 'text-[#4ADE80] border-[#4ADE80]/30 bg-[#4ADE80]/5';
  if (status === 'FLAGGED' || status === 'SUSPENDED') return 'text-red-400 border-red-500/30 bg-red-500/5';
  return 'text-[#475569] border-white/10 bg-white/[0.02]';
}

const KNOWN_PROTOCOLS = ['MCP', 'A2A', 'x402', 'web', 'github', 'attestations'] as const;

function isProtocolActive(protocol: string, agent: AgentDetail): boolean {
  return (agent.metadata?.services ?? []).some(
    (s) => s.name.toLowerCase() === protocol.toLowerCase(),
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

type Tab = 'overview' | 'activity' | 'community' | 'metadata';

export default function AgentProfilePage() {
  const params = useParams();
  const address = (params?.address as string) || '';
  
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [imageError, setImageError] = useState(false);

  const { data: agent, isLoading, isError, error, refetch } = useAgent(address, {
    enabled: !!address,
  });

  const { data: heartbeats } = useQuery({
    queryKey: ['heartbeats-recent', address],
    queryFn: async () => {
      const res = await fetch(`/api/v1/agents/${address}/heartbeats?period=7d&limit=10`);
      if (!res.ok) return null;
      const json = await res.json();
      return json.data || null;
    },
    enabled: !!address,
  });

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-[#05070A] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#4ADE80]">INITIALIZING_SECURE_SYNC...</p>
        </div>
      </div>
    );
  }

  if (isError || !agent) {
    return (
      <div className="min-h-screen bg-[#05070A] flex flex-col items-center justify-center p-8">
        <div className="border border-red-500/20 bg-red-500/5 p-12 text-center max-w-xl">
           <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-6" />
           <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">PROFILE_NOT_LOCATED</h1>
           <p className="text-sm text-[#64748B] mb-8 font-mono">{error instanceof Error ? error.message : 'The requested agent address does not exist in the Enigma registry.'}</p>
           <div className="flex items-center justify-center gap-4">
              <Link href="/scanner" className="h-12 px-8 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[11px] flex items-center justify-center hover:bg-white/10 transition-all text-center">RETURN_TO_BASE</Link>
              <button onClick={() => refetch()} className="h-12 px-8 bg-[#4ADE80] text-[#05070A] font-black uppercase tracking-widest text-[11px] flex items-center justify-center hover:brightness-110 transition-all">RETRY_SYNC</button>
           </div>
        </div>
      </div>
    );
  }

  const vol24hDisplay = agent.volumes?.['24h'] ? `${parseFloat(agent.volumes['24h'].volumeAvax).toFixed(1)} AVAX` : '—';

  const breakdownRows = [
    { label: 'Volume', score: agent.trustScore?.breakdown?.volume?.score || 0 },
    { label: 'Uptime', score: agent.trustScore?.breakdown?.uptime?.score || 0 },
    { label: 'Proxy',  score: agent.trustScore?.breakdown?.proxy?.score || 0 },
    { label: 'Security', score: agent.trustScore?.breakdown?.ozMatch?.score || 0 },
    { label: 'Ratings', score: agent.trustScore?.breakdown?.ratings?.score || 0 },
  ];

  const allEvents = [
    ...(heartbeats?.logs || []).map((h: any) => ({ 
      id: h.id, 
      type: 'HEARTBEAT', 
      time: h.timestamp, 
      label: `${h.result} · ${h.responseTimeMs}ms`, 
      sortKey: new Date(h.timestamp).getTime() 
    })),
    ...(agent.ratings?.recent || []).map((r) => ({ 
      id: r.id, 
      type: 'RATING', 
      time: r.createdAt, 
      label: `${r.rating}★ from ${truncateAddress(r.userAddress)}`, 
      sortKey: new Date(r.createdAt).getTime() 
    })),
  ].sort((a, b) => b.sortKey - a.sortKey).slice(0, 10);

  const tabs = [
    { id: 'overview' as Tab,  label: 'Overview', icon: LayoutDashboard },
    { id: 'activity' as Tab,  label: 'Activity', icon: Activity, count: allEvents.length },
    { id: 'community' as Tab, label: 'Community', icon: Users, count: agent.ratings?.count || 0 },
    ...(agent.metadata ? [{ id: 'metadata' as Tab, label: 'Metadata', icon: FileCode2 }] : []),
  ];

  return (
    <div className="min-h-screen bg-[#05070A] relative overflow-hidden selection:bg-[#4ADE80] selection:text-[#05070A]">
      {/* Background Decor */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-8 pt-8 relative z-10 flex flex-col gap-8 pb-32">
        
        {/* Navigation / Header Info */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6" data-tour="agent-stats">
           <Link href="/scanner" className="group flex items-center gap-3 w-fit">
              <div className="h-8 w-8 flex items-center justify-center border border-[#4ADE80]/10 bg-[#4ADE80]/5 group-hover:border-[#4ADE80]/40 transition-all">
                 <ArrowLeft className="h-4 w-4 text-[#4ADE80]" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#475569] group-hover:text-white transition-colors">Scanner_Index</span>
           </Link>

           <div className="flex items-center gap-6">
              <MetricBadge label="UPTIME" value={`${agent.uptime?.percentage?.toFixed(1) || 0}%`} />
              <MetricBadge label="VOLUME_24H" value={vol24hDisplay} />
              <MetricBadge label="TRUST_SCORE" value={`${agent.trustScore?.score || 0}/100`} />
              <div className={cn("px-4 py-1.5 border text-[10px] font-black uppercase tracking-widest ml-4 shadow-xl", statusClass(agent.status))}>
                 {agent.status}
              </div>
           </div>
        </div>

        {/* Profile Card Main */}
        <div 
           className="border border-white/10 bg-[#0F1219]/60 p-8 md:p-12 relative overflow-hidden group shadow-[0_40px_100px_rgba(0,0,0,0.8)]"
           data-tour="agent-header"
        >
           <IndustrialCorner position="tr" size={6} />
           <IndustrialCorner position="bl" size={6} />
           
           <div className="flex flex-col md:flex-row gap-12 items-start relative z-10">
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-4 shrink-0">
                 <div className="h-32 w-32 border-2 border-[#4ADE80]/20 bg-[#05070A] flex items-center justify-center relative shadow-[0_0_30px_rgba(74,222,128,0.05)]">
                    {agent.metadata?.image && !imageError ? (
                       <img 
                          src={agent.metadata.image} 
                          className="h-full w-full object-cover grayscale brightness-90 hover:grayscale-0 hover:brightness-100 transition-all duration-700" 
                          alt={agent.name}
                          onError={() => setImageError(true)} 
                       />
                    ) : (
                       <Bot className="h-12 w-12 text-[#4ADE80]/30" />
                    )}
                    {/* Visual ID Marker */}
                    <div className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center">
                       <span className="text-[9px] font-mono text-[#4ADE80]/40">#ID</span>
                    </div>
                 </div>
                 <div className="flex flex-col items-center gap-1">
                    <span className="text-[9px] font-mono text-[#475569] uppercase tracking-[0.3em]">VERSION_1.0.4</span>
                 </div>
              </div>

              {/* Identity Section */}
              <div className="flex-1 min-w-0">
                 <div className="flex flex-col gap-2 mb-6">
                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">{agent.name}</h1>
                    <div className="flex items-center gap-3">
                       <p className="text-sm font-mono text-[#4ADE80]/60 truncate max-w-md">{address}</p>
                       <button onClick={handleCopy} className="text-[#4ADE80]/30 hover:text-[#4ADE80] transition-colors">
                          {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                       </button>
                    </div>
                 </div>

                 <p className="text-lg font-medium text-[#94A3B8] leading-relaxed max-w-3xl mb-8">
                    {agent.description || "Experimental autonomous agent instance protocol active on Enigma core layer."}
                 </p>

                 <div className="flex flex-wrap gap-4 mt-auto pt-6 border-t border-white/5" data-tour="agent-actions">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-[10px] font-black text-[#64748B] uppercase tracking-widest">
                       TYPE::{agent.type}
                    </div>
                    {agent.registryAddress && (
                       <div className="flex items-center gap-2 px-4 py-2 bg-[#4ADE80]/5 border border-[#4ADE80]/20 text-[10px] font-black text-[#4ADE80] uppercase tracking-widest">
                          REGISTRY::{truncateAddress(agent.registryAddress)}
                       </div>
                    )}
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-[10px] font-black text-[#64748B] uppercase tracking-widest hover:bg-white/10 transition-all">
                       <Share2 className="h-3 w-3" /> EXPORT_CERT
                    </button>
                    <ReportModal agentAddress={address} />
                 </div>
              </div>

              {/* Right Side - Trust Score Chart / Summary */}
              <div className="w-full md:w-64 space-y-6 shrink-0 pt-4" data-tour="agent-score">
                 <div className="flex justify-between items-baseline mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#4ADE80]">CORE_TRUST</span>
                    <span className="text-2xl font-black text-white">{agent.trustScore?.score || 0}%</span>
                 </div>
                 <div className="h-2 w-full bg-[#05070A] border border-white/5 overflow-hidden">
                    <div 
                       className="h-full bg-[#4ADE80] transition-all duration-[1500ms] shadow-[0_0_20px_#4ADE80]" 
                       style={{ width: `${agent.trustScore?.score || 0}%` }} 
                    />
                 </div>
                 <div className="space-y-3 pt-4">
                    {breakdownRows.map(row => (
                       <div key={row.label} className="flex justify-between items-center text-[10px] font-black uppercase">
                          <span className="text-[#475569]">{row.label}</span>
                          <span className="text-[#94A3B8] font-mono">{row.score}pt</span>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Horizontal Navigation Console */}
        <div className="flex border-b border-white/10 bg-[#0F1219]/20 px-8" data-tour="agent-tabs">
           {tabs.map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={cn(
                 "px-8 py-5 text-[11px] font-black uppercase tracking-widest transition-all relative group",
                 activeTab === tab.id ? "text-white" : "text-[#475569] hover:text-[#94A3B8]"
               )}
             >
                {activeTab === tab.id && (
                   <div className="absolute left-0 right-0 bottom-0 h-1 bg-[#4ADE80] shadow-[0_0_12px_#4ADE80]" />
                )}
                <div className="flex items-center gap-3">
                   <tab.icon className={cn("h-3.5 w-3.5", activeTab === tab.id ? "text-[#4ADE80]" : "text-[#475569]")} />
                   {tab.label}
                   {tab.count !== undefined && tab.count > 0 && (
                      <span className="text-[9px] opacity-40 font-mono">({tab.count})</span>
                   )}
                </div>
             </button>
           ))}
        </div>

        {/* Tab Content Display */}
        <div className="bg-[#05070A]/20 min-h-[400px]">
           
           {activeTab === 'overview' && (
              <div className="animate-fade-in-up grid grid-cols-1 lg:grid-cols-3 gap-8">
                 <div className="lg:col-span-2 space-y-8">
                    <div className="p-8 border border-white/5 bg-[#0F1219]/40">
                       <SectionHeading title="Identity_Protocol" icon={Shield} />
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                          <DetailRow label="Contract_Hash" value={address} mono />
                          <DetailRow label="Registry_Core" value={agent.registryAddress || 'GENESIS'} mono />
                          <DetailRow label="Authority_Key" value={agent.ownerAddress || 'SYSTEM'} mono />
                          <DetailRow label="Cycle_Longevity" value={formatAge(agent.createdAt)} />
                          <DetailRow label="Status_Verified" value={agent.status} />
                          <DetailRow label="Network_L1" value="Avalanche C-Chain" />
                       </div>
                    </div>

                    <div className="p-8 border border-white/5 bg-[#0F1219]/40">
                       <SectionHeading title="Capability_Matrix" icon={GitBranch} />
                       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {KNOWN_PROTOCOLS.map(p => (
                             <div key={p} className={cn(
                                "p-4 border text-center transition-all",
                                isProtocolActive(p, agent) 
                                   ? "border-[#4ADE80]/20 bg-[#4ADE80]/5 text-[#4ADE80]" 
                                   : "border-white/5 bg-white/[0.02] text-[#475569]"
                             )}>
                                <p className="text-[10px] font-black uppercase tracking-widest">{p}</p>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>

                 <div className="space-y-8">
                    <div className="p-8 border border-[#4ADE80]/10 bg-[#4ADE80]/[0.03] relative overflow-hidden">
                       <IndustrialCorner position="tr" size={4} />
                       <SectionHeading title="Security_Policy" icon={Lock} />
                       <div className="space-y-5">
                          <div className="flex items-center gap-4">
                             <div className="h-10 w-10 shrink-0 flex items-center justify-center bg-[#4ADE80]/10 border border-[#4ADE80]/20">
                                <Shield className="h-5 w-5 text-[#4ADE80]" />
                             </div>
                             <div>
                                <p className="text-[10px] font-black text-white uppercase">Multi-Sig Guard</p>
                                <p className="text-[9px] text-[#64748B] uppercase">Active on Registry</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-4">
                             <div className="h-10 w-10 shrink-0 flex items-center justify-center bg-[#4ADE80]/10 border border-[#4ADE80]/20">
                                <FileCode2 className="h-5 w-5 text-[#4ADE80]" />
                             </div>
                             <div>
                                <p className="text-[10px] font-black text-white uppercase">Audit Status</p>
                                <p className="text-[9px] text-[#64748B] uppercase">Verified Protocol</p>
                             </div>
                          </div>
                       </div>
                    </div>

                    <Link 
                       href={agent?.registryAddress ? `https://snowtrace.io/token/${agent.registryAddress}?a=${agent.tokenId}` : `https://snowtrace.io/address/${address}`}
                       target="_blank"
                       className="group flex items-center justify-between p-8 border border-white/5 bg-[#0F1219]/40 hover:bg-[#4ADE80]/5 hover:border-[#4ADE80]/20 transition-all"
                    >
                       <div>
                          <p className="text-[10px] font-black text-[#475569] uppercase group-hover:text-[#4ADE80]">External_Explorer</p>
                          <p className="text-xs font-black text-white uppercase mt-1">View_on_Snowtrace</p>
                       </div>
                       <ExternalLink className="h-5 w-5 text-[#475569] group-hover:text-[#4ADE80] transition-colors" />
                    </Link>
                 </div>
              </div>
           )}

           {activeTab === 'activity' && (
              <div className="animate-fade-in-up p-8 border border-white/5 bg-[#0F1219]/40">
                 <SectionHeading title="System_Event_Log" icon={Activity} />
                 <div className="space-y-2">
                    {allEvents.length > 0 ? allEvents.map((evt) => (
                       <div key={evt.id} className="group flex items-center gap-8 p-4 border-b border-white/5 hover:bg-[#4ADE80]/5 transition-all">
                          <span className="text-[10px] font-mono text-[#475569] w-32">{formatEventDate(evt.time)}</span>
                          <span className={cn(
                             "text-[9px] font-black uppercase px-3 py-1 border",
                             evt.type === 'HEARTBEAT' ? "text-[#4ADE80] border-[#4ADE80]/20" : "text-[#22D3EE] border-[#22D3EE]/20"
                          )}>{evt.type}</span>
                          <span className="text-sm font-medium text-white flex-1">{evt.label}</span>
                          <div className="h-2 w-2 rounded-full bg-[#4ADE80] opacity-0 group-hover:opacity-100 shadow-[0_0_8px_#4ADE80] transition-opacity" />
                       </div>
                    )) : (
                       <div className="py-24 text-center">
                          <AlertTriangle className="h-10 w-10 text-[#475569] mx-auto mb-4 opacity-20" />
                          <p className="uppercase tracking-[0.4em] text-[#475569] text-[10px]">No_Event_Logs_Synchronized</p>
                       </div>
                    )}
                 </div>
              </div>
           )}

           {activeTab === 'community' && (
              <div className="animate-fade-in-up grid grid-cols-1 lg:grid-cols-3 gap-12">
                 <div className="lg:col-span-2 space-y-6">
                    {(agent.ratings?.recent || []).map((r, idx) => (
                       <div key={idx} className="p-8 border border-white/5 bg-[#0F1219]/40 relative">
                          <div className="flex items-center justify-between mb-6">
                             <div className="flex gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                   <div key={i} className={cn("h-4 w-4", i < r.rating ? "text-[#FCD34D]" : "text-[#475569]/20")}>★</div>
                                ))}
                             </div>
                             <span className="text-[10px] font-mono text-[#475569]">{formatRelativeTime(r.createdAt)}</span>
                          </div>
                          <p className="text-white text-md mb-8 leading-relaxed font-medium">&quot;{r.review || 'Sequence validated without comment.'}&quot;</p>
                          <div className="flex items-center gap-3">
                             <div className="h-px w-8 bg-[#4ADE80]/40" />
                             <p className="text-[10px] font-black text-[#4ADE80] uppercase tracking-widest">USER::{truncateAddress(r.userAddress)}</p>
                          </div>
                       </div>
                    ))}
                    {(!agent.ratings?.recent || agent.ratings.recent.length === 0) && (
                       <div className="py-24 border border-white/5 bg-white/[0.02] text-center">
                         <Users className="h-10 w-10 text-[#475569] mx-auto mb-4 opacity-10" />
                         <p className="uppercase tracking-widest text-[#475569] text-[10px]">Awaiting_Agent_Appraisal</p>
                       </div>
                    )}
                 </div>
                 <div className="p-8 border border-[#4ADE80]/10 bg-[#4ADE80]/5 h-fit sticky top-8">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#4ADE80] mb-8">INBOUND_RATING_CHANNEL</p>
                    <RatingForm agentAddress={address} />
                 </div>
              </div>
           )}

           {activeTab === 'metadata' && (
              <div className="animate-fade-in-up">
                 <div className="relative border border-[#4ADE80]/10 bg-[#05070A]/80 p-10 shadow-inner overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-5 uppercase font-black text-8xl select-none">BLOB</div>
                    <pre className="text-xs font-mono text-[#4ADE80] leading-relaxed overflow-x-auto whitespace-pre-wrap">
                       {JSON.stringify(agent.metadata, null, 3)}
                    </pre>
                 </div>
              </div>
           )}

        </div>

      </div>

      <TourCta page="agent" />
    </div>
  );
}

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
   return (
      <div className="flex flex-col gap-2 border-b border-white/5 pb-4">
         <span className="text-[9px] font-black uppercase text-[#475569] tracking-widest">{label}</span>
         <span className={cn("text-[13px] font-semibold text-white truncate", mono && "font-mono text-[#4ADE80]")}>{value || '—'}</span>
      </div>
   );
}

function formatAge(dateString: string): string {
  try {
    const diffDays = Math.floor((Date.now() - new Date(dateString).getTime()) / 86400000);
    if (diffDays === 0) return 'today';
    if (diffDays === 1) return '1 day';
    if (diffDays < 30) return `${diffDays} days`;
    const months = Math.floor(diffDays / 30);
    return months === 1 ? '1 month' : `${months} months`;
  } catch {
    return '0 days';
  }
}

function formatEventDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return '01-01-1970';
  }
}
