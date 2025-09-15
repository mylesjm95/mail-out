-- Add role column to User table
ALTER TABLE "User" ADD COLUMN "role" TEXT DEFAULT 'user';
ALTER TABLE "User" ADD COLUMN "assigned_agent_id" UUID;

-- Create Agent table
CREATE TABLE "agents" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "email" TEXT UNIQUE NOT NULL,
    "phone" TEXT,
    "photo" TEXT,
    "bio" TEXT,
    "specialties" TEXT[] DEFAULT '{}',
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Create Building table
CREATE TABLE "buildings" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "slug" TEXT UNIQUE NOT NULL,
    "address" JSONB NOT NULL,
    "description" TEXT,
    "amenities" TEXT[] DEFAULT '{}',
    "photos" TEXT[] DEFAULT '{}',
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Create Inquiry table
CREATE TABLE "inquiries" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "agent_id" UUID REFERENCES "agents"("id"),
    "building_id" UUID REFERENCES "buildings"("id"),
    "listing_key" TEXT,
    "type" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT DEFAULT 'new',
    "priority" TEXT DEFAULT 'normal',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key constraint for assigned_agent_id
ALTER TABLE "User" ADD CONSTRAINT "User_assigned_agent_id_fkey" 
    FOREIGN KEY ("assigned_agent_id") REFERENCES "agents"("id");

-- Create indexes for better performance
CREATE INDEX "agents_email_idx" ON "agents"("email");
CREATE INDEX "agents_is_active_idx" ON "agents"("is_active");
CREATE INDEX "buildings_slug_idx" ON "buildings"("slug");
CREATE INDEX "buildings_is_active_idx" ON "buildings"("is_active");
CREATE INDEX "inquiries_user_id_idx" ON "inquiries"("user_id");
CREATE INDEX "inquiries_agent_id_idx" ON "inquiries"("agent_id");
CREATE INDEX "inquiries_building_id_idx" ON "inquiries"("building_id");
CREATE INDEX "inquiries_status_idx" ON "inquiries"("status");
CREATE INDEX "inquiries_created_at_idx" ON "inquiries"("created_at");

-- Grant permissions
GRANT ALL ON "agents" TO anon, authenticated;
GRANT ALL ON "buildings" TO anon, authenticated;
GRANT ALL ON "inquiries" TO anon, authenticated;
