ALTER TABLE "documents" RENAME COLUMN "project_id" TO "workspace_id";--> statement-breakpoint
ALTER TABLE "documents" DROP CONSTRAINT "documents_project_id_workspaces_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "documents_project_id_idx";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "documents" ADD CONSTRAINT "documents_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "documents_workspace_id_idx" ON "documents" USING btree ("workspace_id");