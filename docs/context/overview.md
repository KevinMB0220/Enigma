# Enigma - Project Overview

> **Discovery, Verification, and Trust Scoring Platform for Autonomous Agents on Avalanche**

**Version:** 1.0.0
**Status:** Pre-Development
**Type:** Web3 DApp - Greenfield Project

---

## What is Enigma?

**Enigma** is the "CoinMarketCap for Autonomous Agents" on Avalanche. A Web3 platform that discovers, verifies, ranks, and scores the trustworthiness of AI/autonomous software agents (ERC-804) deployed on Avalanche C-Chain.

## Problem Statement

In the emerging ecosystem of autonomous agents on blockchain:

- **No centralized visibility** of available agents
- **Users cannot evaluate trustworthiness** before interacting with an agent
- **Malicious agents with hidden proxies** can change behavior post-deployment
- **No reputation standard** for agent-to-agent interactions
- **Legitimate developers have nowhere to showcase** their agents

## Solution

Enigma provides:

1. **Scanner/Directory**: Table view with filters, search, and ranking of all ERC-804 agents
2. **Trust Score**: Composite score (0-100) based on multiple verifiable signals
3. **Active Verification (Centinela)**: Engine that detects proxies, verifies uptime, and analyzes code
4. **Public Profiles**: Each agent has its page with metrics, history, and reputation
5. **REST API**: Programmatic queries for agents evaluating other agents
6. **Feedback System**: Community ratings and reports

## Target Users

| Persona | Need |
|---------|------|
| **DeFi Power User** | Find safe trading agents before delegating funds |
| **Agent Developer** | Register and gain visibility for legitimate agents |
| **Autonomous Agent** | Programmatically verify trustworthiness of another agent |
| **DAO Investor** | Consolidated dashboard of agent portfolio |

## Success Metrics (MVP)

- ✅ 50+ agents registered in first week
- ✅ 500+ unique users connecting wallet
- ✅ 1000+ daily API queries
- ✅ Functional Trust Score with 3+ active signals
- ✅ <2s initial load time
- ✅ 99.5% Scanner uptime

## Why Avalanche?

- **Performance**: Sub-second transactions, low fees (~$0.01)
- **EVM-compatible**: All Ethereum tooling works
- **Growing ecosystem**: Active community in autonomous agents
- **Subnets**: Potential to scale to own subnet in the future
- **Hackathon target**: Project oriented to compete in Avalanche Hackathon

## Why No Custom Smart Contracts in MVP?

**Critical architectural decision**: Enigma does NOT deploy its own smart contracts in the MVP.

**Reasons**:
- **Time-to-market**: Contracts add complexity (audit, gas, upgrades)
- **Off-chain Trust Score is sufficient**: Score is calculated in backend, read via API
- **Flexibility**: Change trust score formula without on-chain redeploys
- **No tokenomics in MVP**: No $SENT token or staking in initial phase
- **Read-only interaction**: We only read agent contracts, we don't write

**Future (post-MVP)**: Will evaluate adding:
- On-chain Registry contract to decentralize listings
- NFT badges for verified agents
- $SENT staking to improve trust score
