# Technical Glossary

| Term | Definition |
|------|------------|
| **ERC-804** | Proposed standard for autonomous agents on blockchain that defines registration, identity, and billing. |
| **Avalanche C-Chain** | EVM-compatible Avalanche chain for smart contracts. ChainID: 43114 (mainnet), 43113 (testnet Fuji). |
| **Trust Score** | Composite score (0-100) reflecting an agent's trustworthiness based on multiple verifiable signals. |
| **Centinela** | Active verification engine that analyzes contracts, detects proxies, and verifies uptime. |
| **Proxy Contract** | Smart contract pattern that delegates calls to another contract (implementation). Risky if undeclared. |
| **EIP-1967** | Standard for proxy contract storage slots. Defines slots for implementation address and beacon. |
| **Heartbeat** | Periodic signal (every hour) that verifies an agent is active and responding. |
| **Trustline** | Synonym for Heartbeat in the context of agent consistency verification. |
| **Billing Address** | Address that receives payments per ERC-804. Used to track transaction volume. |
| **OpenZeppelin (OZ) Match** | Percentage of contract bytecode that matches standard OpenZeppelin templates. |
| **Supabase** | Backend-as-a-Service with PostgreSQL, auth, storage, and edge functions. |
| **Prisma** | Type-safe ORM for TypeScript with migrations and automatic type generation. |
| **wagmi** | React hooks library for Ethereum/EVM wallet interaction. |
| **viem** | Low-level library for blockchain interaction, modern alternative to ethers.js. |
| **shadcn/ui** | Collection of accessible and customizable UI components for React/Tailwind. |
| **TanStack Query** | Server state management library (cache, refetch, mutations). Formerly React Query. |
| **Zod** | Schema validation library with TypeScript type inference. |
| **BFF** | Backend for Frontend - API pattern where frontend has its own dedicated backend. |
| **SSR** | Server-Side Rendering - rendering pages on the server before sending to client. |
| **SSG** | Static Site Generation - pre-rendering pages at build time. |
| **RPC** | Remote Procedure Call - protocol for communicating with blockchain nodes. |
| **ABI** | Application Binary Interface - JSON description of smart contract functions. |
| **UUPS** | Universal Upgradeable Proxy Standard - upgrade pattern for smart contracts. |
| **Diamond** | Multi-facet proxy pattern (EIP-2535) allowing modular contract upgrades. |
