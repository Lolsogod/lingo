CREATE TABLE IF NOT EXISTS "user_deck" (
	"user_id" text NOT NULL,
	"deck_id" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_deck" ADD CONSTRAINT "user_deck_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_deck" ADD CONSTRAINT "user_deck_deck_id_deck_id_fk" FOREIGN KEY ("deck_id") REFERENCES "deck"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
