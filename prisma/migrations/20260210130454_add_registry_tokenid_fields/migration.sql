-- Add ERC-8004 registry fields to agents table
-- These fields allow proper linking to the NFT in the Identity Registry

-- Add registry_address column (where the agent's NFT is registered)
ALTER TABLE "agents" ADD COLUMN "registry_address" TEXT;

-- Add token_id column (the NFT tokenId in the registry)
ALTER TABLE "agents" ADD COLUMN "token_id" INTEGER;

-- Add token_uri column (the tokenURI from the registry)
ALTER TABLE "agents" ADD COLUMN "token_uri" TEXT;

-- Add index on token_id for faster lookups
CREATE INDEX "agents_token_id_idx" ON "agents"("token_id");

-- Add composite index on registry_address and token_id for unique agent identification
CREATE INDEX "agents_registry_token_idx" ON "agents"("registry_address", "token_id");
