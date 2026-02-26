import { ImageResponse } from 'next/og';
import { prisma } from '@/lib/database/prisma';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const alt    = 'Enigma Trust Certificate';
export const size   = { width: 1200, height: 630 };
export const contentType = 'image/png';

function scoreColor(score: number) {
  if (score >= 80) return '#4ADE80';
  if (score >= 60) return '#22D3EE';
  if (score >= 40) return '#FCD34D';
  return '#FB7185';
}

function statusColor(status: string) {
  switch (status) {
    case 'VERIFIED':  return '#4ADE80';
    case 'PENDING':   return '#FCD34D';
    case 'FLAGGED':
    case 'SUSPENDED': return '#FB7185';
    default:          return '#94A3B8';
  }
}

export default async function Image({ params }: { params: { address: string } }) {
  const address = params.address.toLowerCase();

  // Load the Enigma logo from the public folder as a base64 data URL
  const logoPath = path.join(process.cwd(), 'public', 'logo-f1-waves-dark.svg');
  const logoData = fs.readFileSync(logoPath, 'utf-8');
  const logoSrc  = `data:image/svg+xml;base64,${Buffer.from(logoData).toString('base64')}`;

  const agent = await prisma.agent.findUnique({
    where:  { address },
    select: {
      name:        true,
      status:      true,
      trust_score: true,
      type:        true,
      description: true,
      owner_address: true,
    },
  });

  const score      = agent?.trust_score ?? 0;
  const name       = agent?.name        ?? 'Unknown Agent';
  const status     = agent?.status      ?? 'PENDING';
  const type       = agent?.type        ?? 'CUSTOM';
  const desc       = agent?.description ?? 'On-chain autonomous agent registered on Avalanche.';
  const truncDesc  = desc.length > 120 ? desc.slice(0, 117) + '…' : desc;
  const sColor     = scoreColor(score);
  const stColor    = statusColor(status);
  const shortAddr  = `${address.slice(0, 10)}…${address.slice(-8)}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#0B0F14',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Left accent bar */}
        <div style={{
          position: 'absolute',
          left: 0, top: 0, bottom: 0,
          width: 4,
          background: `linear-gradient(180deg, ${sColor}, transparent 70%)`,
        }} />

        {/* Background glow */}
        <div style={{
          position: 'absolute',
          top: -200, left: -100,
          width: 600, height: 600,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${sColor}08 0%, transparent 70%)`,
        }} />

        {/* ── Header ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '40px 56px 32px',
        }}>
          {/* Logo + wordmark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoSrc} width={40} height={40} alt="Enigma" style={{ borderRadius: 10, objectFit: 'contain' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: '#ffffff', fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' }}>ENIGMA</span>
              <span style={{ color: '#475569', fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase' }}>Reputation Layer</span>
            </div>
          </div>

          {/* Certificate badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8, padding: '8px 16px',
          }}>
            <span style={{ color: '#64748B', fontSize: 12, letterSpacing: '1px', textTransform: 'uppercase' }}>Trust Certificate</span>
            <span style={{ color: '#334155', fontSize: 12 }}>·</span>
            <span style={{ color: '#475569', fontSize: 12 }}>ERC-8004</span>
          </div>
        </div>

        {/* ── Main content ── */}
        <div style={{ display: 'flex', flex: 1, padding: '0 56px', gap: 40 }}>

          {/* Left: name + address + desc */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
            {/* Agent type pill */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              marginBottom: 16,
            }}>
              <div style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 4, padding: '2px 10px',
                color: '#64748B', fontSize: 12, letterSpacing: '1px', textTransform: 'uppercase',
              }}>
                {type}
              </div>
            </div>

            {/* Name */}
            <div style={{
              fontSize: name.length > 24 ? 42 : 52,
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.1,
              letterSpacing: '-1px',
              marginBottom: 12,
            }}>
              {name}
            </div>

            {/* Address */}
            <div style={{
              fontSize: 14,
              color: '#334155',
              fontFamily: 'monospace',
              marginBottom: 20,
            }}>
              {shortAddr}
            </div>

            {/* Description */}
            <div style={{
              fontSize: 15,
              color: '#64748B',
              lineHeight: 1.6,
              maxWidth: 560,
            }}>
              {truncDesc}
            </div>
          </div>

          {/* Right: score + status */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 12,
            justifyContent: 'center', flexShrink: 0, width: 200,
          }}>
            {/* Trust Score */}
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              background: `${sColor}10`,
              border: `1px solid ${sColor}30`,
              borderRadius: 16, padding: '24px 20px',
              gap: 4,
            }}>
              <span style={{ color: '#475569', fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Trust Score</span>
              <span style={{ color: sColor, fontSize: 72, fontWeight: 900, lineHeight: 1 }}>{score}</span>
              <span style={{ color: '#334155', fontSize: 14 }}>/100</span>
            </div>

            {/* Status */}
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              background: `${stColor}10`,
              border: `1px solid ${stColor}25`,
              borderRadius: 12, padding: '16px 20px',
              gap: 2,
            }}>
              <span style={{ color: '#475569', fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Status</span>
              <span style={{ color: stColor, fontSize: 20, fontWeight: 700 }}>{status}</span>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '24px 56px 40px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          marginTop: 8,
        }}>
          <span style={{ color: '#1E293B', fontSize: 13, fontFamily: 'monospace' }}>
            enigma.app/agents/{address.slice(0, 10)}…
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#4ADE80',
              boxShadow: '0 0 6px #4ADE80',
            }} />
            <span style={{ color: '#4ADE80', fontSize: 13, fontWeight: 600 }}>Verified on Avalanche</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
