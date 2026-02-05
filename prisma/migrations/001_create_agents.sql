-- Create enums
CREATE TYPE "AgentType" AS ENUM ('TRADING', 'LENDING', 'GOVERNANCE', 'ORACLE', 'CUSTOM');
CREATE TYPE "AgentStatus" AS ENUM ('PENDING', 'VERIFIED', 'FLAGGED', 'SUSPENDED');
CREATE TYPE "ProxyType" AS ENUM ('NONE', 'EIP1967', 'BEACON', 'TRANSPARENT', 'CUSTOM');

-- Create agents table
CREATE TABLE "agents" (
    "address" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" "AgentType" NOT NULL,
    "description" TEXT,
    "owner_address" TEXT NOT NULL,
    "billing_address" TEXT,
    "status" "AgentStatus" NOT NULL DEFAULT 'PENDING',
    "trust_score" INTEGER NOT NULL DEFAULT 0,
    "is_proxy" BOOLEAN NOT NULL DEFAULT false,
    "proxy_type" "ProxyType" NOT NULL DEFAULT 'NONE',
    "implementation_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX "agents_type_idx" ON "agents"("type");
CREATE INDEX "agents_status_idx" ON "agents"("status");
CREATE INDEX "agents_trust_score_idx" ON "agents"("trust_score" DESC);
CREATE INDEX "agents_owner_address_idx" ON "agents"("owner_address");

-- Create trust_scores table
CREATE TABLE "trust_scores" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "agent_id" TEXT NOT NULL,
    "overall_score" DOUBLE PRECISION NOT NULL,
    "volume_score" DOUBLE PRECISION NOT NULL,
    "proxy_score" DOUBLE PRECISION NOT NULL,
    "uptime_score" DOUBLE PRECISION NOT NULL,
    "oz_match_score" DOUBLE PRECISION NOT NULL,
    "community_score" DOUBLE PRECISION NOT NULL,
    "calculated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "snapshot_data" JSONB,
    CONSTRAINT "trust_scores_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agents"("address") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "trust_scores_agent_id_idx" ON "trust_scores"("agent_id");
CREATE INDEX "trust_scores_calculated_at_idx" ON "trust_scores"("calculated_at");
CREATE INDEX "trust_scores_overall_score_idx" ON "trust_scores"("overall_score");

-- Create ratings table
CREATE TABLE "ratings" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "agent_id" TEXT NOT NULL,
    "user_address" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "review" TEXT,
    "tx_hash" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ratings_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agents"("address") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "ratings_agent_id_user_address_key" ON "ratings"("agent_id", "user_address");
CREATE INDEX "ratings_user_address_idx" ON "ratings"("user_address");
CREATE INDEX "ratings_created_at_idx" ON "ratings"("created_at");

-- Create users table
CREATE TABLE "users" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "wallet_address" TEXT NOT NULL UNIQUE,
    "display_name" TEXT,
    "avatar_url" TEXT,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "users_wallet_address_idx" ON "users"("wallet_address");

-- Create watchlists table
CREATE TABLE "watchlists" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "watchlists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "watchlists_user_id_idx" ON "watchlists"("user_id");

-- Create watchlist_items table
CREATE TABLE "watchlist_items" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "watchlist_id" TEXT NOT NULL,
    "agent_id" TEXT NOT NULL,
    "added_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "watchlist_items_watchlist_id_fkey" FOREIGN KEY ("watchlist_id") REFERENCES "watchlists"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "watchlist_items_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agents"("address") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "watchlist_items_watchlist_id_agent_id_key" ON "watchlist_items"("watchlist_id", "agent_id");

-- Create scanner_results table
CREATE TABLE "scanner_results" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "agent_id" TEXT NOT NULL,
    "scan_type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "findings" JSONB,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    CONSTRAINT "scanner_results_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agents"("address") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "scanner_results_agent_id_idx" ON "scanner_results"("agent_id");
CREATE INDEX "scanner_results_status_idx" ON "scanner_results"("status");
CREATE INDEX "scanner_results_started_at_idx" ON "scanner_results"("started_at");

-- Create api_keys table
CREATE TABLE "api_keys" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "key_hash" TEXT NOT NULL UNIQUE,
    "permissions" TEXT[] NOT NULL,
    "rate_limit" INTEGER NOT NULL DEFAULT 1000,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_used_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "api_keys_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "api_keys_user_id_idx" ON "api_keys"("user_id");
CREATE INDEX "api_keys_key_hash_idx" ON "api_keys"("key_hash");

-- Create daily_metrics table
CREATE TABLE "daily_metrics" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "date" DATE NOT NULL UNIQUE,
    "total_agents" INTEGER NOT NULL,
    "new_agents" INTEGER NOT NULL,
    "verified_agents" INTEGER NOT NULL,
    "total_scans" INTEGER NOT NULL,
    "total_ratings" INTEGER NOT NULL,
    "active_users" INTEGER NOT NULL,
    "avg_trust_score" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "daily_metrics_date_idx" ON "daily_metrics"("date");

-- Enable Row Level Security on all tables
ALTER TABLE "agents" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "trust_scores" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ratings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "watchlists" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "watchlist_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "scanner_results" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "api_keys" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "daily_metrics" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow read for all, write requires authentication)
CREATE POLICY "Allow public read access" ON "agents" FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON "trust_scores" FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON "ratings" FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON "scanner_results" FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON "daily_metrics" FOR SELECT USING (true);

-- Users can read their own data
CREATE POLICY "Users can read own data" ON "users" FOR SELECT USING (auth.uid()::text = id);
CREATE POLICY "Users can read own watchlists" ON "watchlists" FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can read own watchlist items" ON "watchlist_items" FOR SELECT
  USING (EXISTS (SELECT 1 FROM watchlists WHERE watchlists.id = watchlist_items.watchlist_id AND watchlists.user_id = auth.uid()::text));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON "agents" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ratings_updated_at BEFORE UPDATE ON "ratings" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON "users" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_watchlists_updated_at BEFORE UPDATE ON "watchlists" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
