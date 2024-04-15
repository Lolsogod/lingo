ALTER TABLE "deck" ADD COLUMN "author_id" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deck" ADD CONSTRAINT "deck_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
