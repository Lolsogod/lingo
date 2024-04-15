ALTER TABLE "deck" RENAME COLUMN "content" TO "name";--> statement-breakpoint
ALTER TABLE "deck" ALTER COLUMN "name" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "deck" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "deck" ADD COLUMN "public" boolean DEFAULT false NOT NULL;