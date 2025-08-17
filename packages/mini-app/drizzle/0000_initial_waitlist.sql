CREATE TABLE IF NOT EXISTS "waitlist_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fid" text NOT NULL,
	"username" text NOT NULL,
	"display_name" text,
	"pfp_url" text,
	"location" text,
	"wallet_address" text,
	"signature" text NOT NULL,
	"signature_message" text,
	"chain_id" text,
	"client_fid" text,
	"platform_type" text,
	"is_active" boolean DEFAULT true,
	"full_context" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create index on fid for faster lookups
CREATE INDEX IF NOT EXISTS "idx_waitlist_fid" ON "waitlist_entries" ("fid");

-- Create index on created_at for ordering
CREATE INDEX IF NOT EXISTS "idx_waitlist_created_at" ON "waitlist_entries" ("created_at");

-- Create unique constraint on fid to prevent duplicates
ALTER TABLE "waitlist_entries" ADD CONSTRAINT "unique_fid" UNIQUE ("fid");
