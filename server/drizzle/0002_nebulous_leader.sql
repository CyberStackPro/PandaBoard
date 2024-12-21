CREATE TYPE "public"."project_type" AS ENUM('folder', 'file');--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "type" "project_type" DEFAULT 'folder' NOT NULL;