CREATE TABLE "disclosure_form_data" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"form_data" jsonb NOT NULL,
	"current_part" integer DEFAULT 1 NOT NULL,
	"parts_completion" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"property_address" text NOT NULL,
	"property_details" jsonb,
	"status" text DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"submitted_at" timestamp with time zone,
	"signed_at" timestamp with time zone,
	"pdf_generated_at" timestamp with time zone,
	"pdf_url" text,
	"signature_data" jsonb,
	"witness_data" jsonb,
	"document_version" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "disclosure_forms" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "disclosure_forms" CASCADE;--> statement-breakpoint
ALTER TABLE "api_usage_logs" DROP CONSTRAINT "api_usage_logs_disclosure_form_id_fkey";
--> statement-breakpoint
ALTER TABLE "audit_logs" DROP CONSTRAINT "audit_logs_disclosure_form_id_fkey";
--> statement-breakpoint
ALTER TABLE "api_usage_logs" ADD CONSTRAINT "api_usage_logs_disclosure_form_id_fkey" FOREIGN KEY ("disclosure_form_id") REFERENCES "public"."disclosure_form_data"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_disclosure_form_id_fkey" FOREIGN KEY ("disclosure_form_id") REFERENCES "public"."disclosure_form_data"("id") ON DELETE set null ON UPDATE no action;