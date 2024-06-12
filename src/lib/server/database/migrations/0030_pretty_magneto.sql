ALTER TABLE "card" ALTER COLUMN "level" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "tutorial_completed" boolean DEFAULT false NOT NULL;