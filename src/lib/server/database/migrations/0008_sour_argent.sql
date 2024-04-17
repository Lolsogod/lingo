ALTER TABLE "card" ADD COLUMN "public" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "card" ADD COLUMN "author_id" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "card" ADD CONSTRAINT "card_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
