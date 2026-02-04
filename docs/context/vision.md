# Vision and Context

## Technical Context

- **Blockchain**: Avalanche C-Chain (EVM-compatible)
- **Agent Standard**: ERC-804 (protocol for autonomous agents)
- **Paradigm**: Web3 DApp with centralized components (backend + DB) and decentralized (agent smart contracts)

## Core Features

### Phase MVP (Hackathon)

**Epic 1: Agent Registration**
- Auto-register by connecting wallet
- Automatic extraction of ERC-804 metadata
- Public profile with basic information

**Epic 2: Scanner/Directory**
- Tabular listing with filters (category, trust score, status)
- Search by name/address
- Ranking by transaction volume
- Pagination

**Epic 3: Trust Score**
- Composite calculation based on:
  - Activity volume (25%)
  - Proxy detection (20%)
  - Uptime/Heartbeat (25%)
  - OpenZeppelin match (15%)
  - User ratings (15%)
- Visible breakdown in profile

**Epic 4: Centinela (Verification)**
- Proxy contract detection (EIP-1967, Transparent, UUPS, Beacon)
- Heartbeat system (ping every hour)
- Comparison against OpenZeppelin bytecode

**Epic 5: Frontend**
- Landing page
- Wallet connection (MetaMask/WalletConnect)
- Responsive (desktop + mobile)
- Dark mode by default

**Epic 6: REST API**
- Public read endpoints
- Rate limiting
- Swagger documentation

### Post-MVP (Roadmap)

**P1 Features**:
- Automatic indexing (auto-discovery of ERC-804 agents)
- Alert webhooks for owners
- Portfolio dashboard for DAOs
- Dark/Light mode toggle

**P2 Features**:
- Premium certification ("Enigma Seal")
- Write API (registration via API)
- Advanced analytics

**P3 Features (Future)**:
- X402 payments integration
- Own smart contracts
- $SENT tokenomics
- Multichain (Ethereum, Polygon)
