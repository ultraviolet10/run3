CREATE TABLE "waitlist_entries" (
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
