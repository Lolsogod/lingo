CREATE TABLE IF NOT EXISTS "card_block" (
	"card_id" uuid NOT NULL,
	"block_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "card" DROP COLUMN IF EXISTS "content";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "card_block" ADD CONSTRAINT "card_block_card_id_card_id_fk" FOREIGN KEY ("card_id") REFERENCES "card"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "card_block" ADD CONSTRAINT "card_block_block_id_block_id_fk" FOREIGN KEY ("block_id") REFERENCES "block"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
