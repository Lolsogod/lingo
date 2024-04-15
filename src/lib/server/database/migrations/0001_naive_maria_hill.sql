CREATE TABLE IF NOT EXISTS "block" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "card" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content" text NOT NULL,
	"topic_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "card_deck" (
	"card_id" uuid NOT NULL,
	"deck_id" uuid NOT NULL,
	CONSTRAINT "card_deck_card_id_deck_id_pk" PRIMARY KEY("card_id","deck_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "deck" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "topic" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content" varchar NOT NULL,
	CONSTRAINT "topic_content_unique" UNIQUE("content")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "card" ADD CONSTRAINT "card_topic_id_topic_id_fk" FOREIGN KEY ("topic_id") REFERENCES "topic"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "card_deck" ADD CONSTRAINT "card_deck_card_id_card_id_fk" FOREIGN KEY ("card_id") REFERENCES "card"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "card_deck" ADD CONSTRAINT "card_deck_deck_id_deck_id_fk" FOREIGN KEY ("deck_id") REFERENCES "deck"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
