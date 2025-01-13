ALTER TYPE "public"."project_status" RENAME TO "workspace_status";--> statement-breakpoint
ALTER TYPE "public"."project_type" RENAME TO "workspace_type";--> statement-breakpoint
ALTER TYPE "public"."project_visibility" RENAME TO "workspace_visibility";--> statement-breakpoint
ALTER TYPE "public"."document_status" ADD VALUE 'trashed';--> statement-breakpoint
ALTER TYPE "public"."workspace_status" ADD VALUE 'trashed';--> statement-breakpoint
ALTER TABLE "projects" RENAME TO "workspaces";--> statement-breakpoint
ALTER TABLE "documents" DROP CONSTRAINT "documents_project_id_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "workspaces" DROP CONSTRAINT "projects_owner_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "workspaces" DROP CONSTRAINT "projects_parent_id_projects_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "projects_owner_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "projects_parent_id_idx";--> statement-breakpoint
ALTER TABLE "workspaces" ADD COLUMN "restored_at" timestamp;--> statement-breakpoint
ALTER TABLE "workspaces" ADD COLUMN "permanent_deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "workspaces" ADD COLUMN "deleted_by" uuid;--> statement-breakpoint
ALTER TABLE "workspaces" ADD COLUMN "path" text;--> statement-breakpoint
ALTER TABLE "workspaces" ADD COLUMN "sort_order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "workspaces" ADD COLUMN "favorite" boolean DEFAULT false;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "documents" ADD CONSTRAINT "documents_project_id_workspaces_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_parent_id_workspaces_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."workspaces"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_deleted_by_users_id_fk" FOREIGN KEY ("deleted_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "workspaces_owner_id_idx" ON "workspaces" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "workspaces_parent_id_idx" ON "workspaces" USING btree ("parent_id");