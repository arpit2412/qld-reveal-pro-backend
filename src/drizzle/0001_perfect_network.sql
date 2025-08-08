ALTER TABLE "disclosure_documents" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "disclosure_forms" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "disclosure_forms" DROP CONSTRAINT "disclosure_forms_status_check";--> statement-breakpoint
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_user_id_fkey";
--> statement-breakpoint
ALTER TABLE "disclosure_documents" DROP CONSTRAINT "disclosure_documents_disclosure_form_id_fkey";
--> statement-breakpoint
DROP INDEX "idx_disclosure_forms_created_at";--> statement-breakpoint
DROP INDEX "idx_disclosure_forms_status";--> statement-breakpoint
DROP INDEX "idx_disclosure_forms_user_id";--> statement-breakpoint
DROP INDEX "idx_disclosure_documents_form_id";--> statement-breakpoint
ALTER TABLE "disclosure_documents" ALTER COLUMN "document_category" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "disclosure_forms" ADD COLUMN "current_part" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "disclosure_forms" ADD COLUMN "parts_completion" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "disclosure_documents" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
DROP POLICY "Users can create their own disclosure forms" ON "disclosure_forms" CASCADE;--> statement-breakpoint
DROP POLICY "Users can update their own disclosure forms" ON "disclosure_forms" CASCADE;--> statement-breakpoint
DROP POLICY "Users can view their own disclosure forms" ON "disclosure_forms" CASCADE;--> statement-breakpoint
DROP POLICY "Users can manage their own disclosure documents" ON "disclosure_documents" CASCADE;--> statement-breakpoint
DROP POLICY "Users can view their own disclosure documents" ON "disclosure_documents" CASCADE;