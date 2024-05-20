ALTER TABLE "block" ADD COLUMN "topic_id" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "block" ADD CONSTRAINT "block_topic_id_topic_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topic"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
