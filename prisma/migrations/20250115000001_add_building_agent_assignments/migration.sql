-- Create BuildingAgent junction table
CREATE TABLE "building_agents" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "building_id" UUID NOT NULL REFERENCES "buildings"("id") ON DELETE CASCADE,
    "agent_id" UUID NOT NULL REFERENCES "agents"("id") ON DELETE CASCADE,
    "is_primary" BOOLEAN DEFAULT false,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Create unique constraint to prevent duplicate assignments
CREATE UNIQUE INDEX "building_agents_building_id_agent_id_key" ON "building_agents"("building_id", "agent_id");

-- Create indexes for better performance
CREATE INDEX "building_agents_building_id_idx" ON "building_agents"("building_id");
CREATE INDEX "building_agents_agent_id_idx" ON "building_agents"("agent_id");
CREATE INDEX "building_agents_is_primary_idx" ON "building_agents"("is_primary");
CREATE INDEX "building_agents_is_active_idx" ON "building_agents"("is_active");

-- Grant permissions
GRANT ALL ON "building_agents" TO anon, authenticated;
