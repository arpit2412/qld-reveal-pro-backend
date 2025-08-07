-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"email" text,
	"full_name" text,
	"company_name" text,
	"user_type" text DEFAULT 'agent',
	"phone" text,
	"is_verified" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"approval_status" text DEFAULT 'pending',
	"approved_by" uuid,
	"approved_at" timestamp with time zone,
	"rejection_reason" text,
	CONSTRAINT "profiles_user_id_key" UNIQUE("user_id"),
	CONSTRAINT "profiles_approval_status_check" CHECK (approval_status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text])),
	CONSTRAINT "profiles_user_type_check" CHECK (user_type = ANY (ARRAY['agent'::text, 'solicitor'::text, 'conveyancer'::text, 'admin'::text]))
);
--> statement-breakpoint
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "user_groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"type" text DEFAULT 'agency' NOT NULL,
	"description" text,
	"contact_email" text,
	"phone" text,
	"address" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_groups_type_check" CHECK (type = ANY (ARRAY['agency'::text, 'law_firm'::text, 'conveyancer'::text]))
);
--> statement-breakpoint
ALTER TABLE "user_groups" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "user_group_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"group_id" uuid NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_group_members_user_id_group_id_key" UNIQUE("user_id","group_id"),
	CONSTRAINT "user_group_members_role_check" CHECK (role = ANY (ARRAY['admin'::text, 'member'::text]))
);
--> statement-breakpoint
ALTER TABLE "user_group_members" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "usage_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"group_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"api_endpoint" text NOT NULL,
	"requests_count" integer DEFAULT 1 NOT NULL,
	"report_date" date DEFAULT CURRENT_DATE NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "usage_reports_group_id_user_id_api_endpoint_report_date_key" UNIQUE("group_id","user_id","api_endpoint","report_date")
);
--> statement-breakpoint
ALTER TABLE "usage_reports" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "data_integrations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"api_type" text NOT NULL,
	"is_enabled" boolean DEFAULT true NOT NULL,
	"configuration" jsonb,
	"usage_quota" integer,
	"current_usage" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "data_integrations_api_type_check" CHECK (api_type = ANY (ARRAY['google_maps'::text, 'corelogic'::text, 'qld_globe'::text, 'docusign'::text, 'council_api'::text]))
);
--> statement-breakpoint
ALTER TABLE "data_integrations" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "disclosure_forms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"form_data" jsonb NOT NULL,
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
	"document_version" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "disclosure_forms_status_check" CHECK (status = ANY (ARRAY['draft'::text, 'submitted'::text, 'signed'::text, 'completed'::text]))
);
--> statement-breakpoint
ALTER TABLE "disclosure_forms" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "disclosure_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"disclosure_form_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"file_name" text NOT NULL,
	"file_type" text NOT NULL,
	"file_size" bigint NOT NULL,
	"storage_path" text NOT NULL,
	"document_category" text,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL,
	"is_required" boolean DEFAULT false
);
--> statement-breakpoint
ALTER TABLE "disclosure_documents" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"disclosure_form_id" uuid,
	"action" text NOT NULL,
	"details" jsonb,
	"ip_address" "inet",
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "audit_logs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "api_usage_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"disclosure_form_id" uuid,
	"api_provider" text NOT NULL,
	"api_endpoint" text NOT NULL,
	"request_data" jsonb,
	"response_data" jsonb,
	"status_code" integer,
	"cost_credits" numeric(10, 4) DEFAULT '0',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "api_usage_logs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_group_members" ADD CONSTRAINT "user_group_members_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."user_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usage_reports" ADD CONSTRAINT "usage_reports_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."user_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "disclosure_documents" ADD CONSTRAINT "disclosure_documents_disclosure_form_id_fkey" FOREIGN KEY ("disclosure_form_id") REFERENCES "public"."disclosure_forms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_disclosure_form_id_fkey" FOREIGN KEY ("disclosure_form_id") REFERENCES "public"."disclosure_forms"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "api_usage_logs" ADD CONSTRAINT "api_usage_logs_disclosure_form_id_fkey" FOREIGN KEY ("disclosure_form_id") REFERENCES "public"."disclosure_forms"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_disclosure_forms_created_at" ON "disclosure_forms" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_disclosure_forms_status" ON "disclosure_forms" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX "idx_disclosure_forms_user_id" ON "disclosure_forms" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_disclosure_documents_form_id" ON "disclosure_documents" USING btree ("disclosure_form_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_audit_logs_created_at" ON "audit_logs" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_audit_logs_user_id" ON "audit_logs" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_api_usage_logs_created_at" ON "api_usage_logs" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_api_usage_logs_user_id" ON "api_usage_logs" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE POLICY "Users can insert their own profile" ON "profiles" AS PERMISSIVE FOR INSERT TO public WITH CHECK ((auth.uid() = user_id));--> statement-breakpoint
CREATE POLICY "Users can update their own profile" ON "profiles" AS PERMISSIVE FOR UPDATE TO public;--> statement-breakpoint
CREATE POLICY "Users can view their own profile" ON "profiles" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Admins can manage all groups" ON "user_groups" AS PERMISSIVE FOR ALL TO public USING ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.user_type = 'admin'::text)))));--> statement-breakpoint
CREATE POLICY "Users can view groups they belong to" ON "user_groups" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Admins can manage group memberships" ON "user_group_members" AS PERMISSIVE FOR ALL TO public USING ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.user_type = 'admin'::text)))));--> statement-breakpoint
CREATE POLICY "Users can view their own group memberships" ON "user_group_members" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Admins can manage all usage reports" ON "usage_reports" AS PERMISSIVE FOR ALL TO public USING ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.user_type = 'admin'::text)))));--> statement-breakpoint
CREATE POLICY "Users can view their own usage reports" ON "usage_reports" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "All authenticated users can view integrations" ON "data_integrations" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Only admins can manage integrations" ON "data_integrations" AS PERMISSIVE FOR ALL TO public;--> statement-breakpoint
CREATE POLICY "Users can create their own disclosure forms" ON "disclosure_forms" AS PERMISSIVE FOR INSERT TO public WITH CHECK ((auth.uid() = user_id));--> statement-breakpoint
CREATE POLICY "Users can update their own disclosure forms" ON "disclosure_forms" AS PERMISSIVE FOR UPDATE TO public;--> statement-breakpoint
CREATE POLICY "Users can view their own disclosure forms" ON "disclosure_forms" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Users can manage their own disclosure documents" ON "disclosure_documents" AS PERMISSIVE FOR ALL TO public USING ((auth.uid() = user_id));--> statement-breakpoint
CREATE POLICY "Users can view their own disclosure documents" ON "disclosure_documents" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Admins can view all audit logs" ON "audit_logs" AS PERMISSIVE FOR SELECT TO public USING ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.user_type = 'admin'::text)))));--> statement-breakpoint
CREATE POLICY "All authenticated users can insert audit logs" ON "audit_logs" AS PERMISSIVE FOR INSERT TO public;--> statement-breakpoint
CREATE POLICY "Users can view their own audit logs" ON "audit_logs" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Admins can view all API usage logs" ON "api_usage_logs" AS PERMISSIVE FOR SELECT TO public USING ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.user_type = 'admin'::text)))));--> statement-breakpoint
CREATE POLICY "Users can view their own API usage logs" ON "api_usage_logs" AS PERMISSIVE FOR SELECT TO public;
*/