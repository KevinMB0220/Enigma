-- Create report enums
CREATE TYPE "ReportReason" AS ENUM ('PROXY_HIDDEN', 'INCONSISTENT_BEHAVIOR', 'SCAM', 'OTHER');
CREATE TYPE "ReportStatus" AS ENUM ('OPEN', 'REVIEWING', 'RESOLVED', 'DISMISSED');

-- Create reports table
CREATE TABLE "reports" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "agent_id" TEXT NOT NULL,
    "reporter_address" TEXT NOT NULL,
    "reason" "ReportReason" NOT NULL,
    "description" TEXT NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'OPEN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "reports_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agents"("address") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Unique constraint: one report per user per agent
CREATE UNIQUE INDEX "reports_agent_id_reporter_address_key" ON "reports"("agent_id", "reporter_address");
CREATE INDEX "reports_agent_id_idx" ON "reports"("agent_id");
CREATE INDEX "reports_reporter_address_idx" ON "reports"("reporter_address");
CREATE INDEX "reports_status_idx" ON "reports"("status");
CREATE INDEX "reports_created_at_idx" ON "reports"("created_at");

-- Enable RLS
ALTER TABLE "reports" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON "reports" FOR SELECT USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON "reports" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
