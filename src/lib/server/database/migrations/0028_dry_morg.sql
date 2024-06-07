ALTER TABLE "card" ADD COLUMN "tags" varchar[] DEFAULT  NOT NULL;--> statement-breakpoint
ALTER TABLE "card" ADD COLUMN "level" integer DEFAULT 1 NOT NULL;