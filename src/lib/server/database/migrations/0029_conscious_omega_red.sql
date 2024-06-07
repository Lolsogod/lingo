ALTER TABLE "card" ALTER COLUMN "tags" SET DATA TYPE text[];--> statement-breakpoint
ALTER TABLE "card" ALTER COLUMN "tags" SET DEFAULT '{}'::text[];