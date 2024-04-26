ALTER TABLE "user_deck" RENAME TO "study_deck";--> statement-breakpoint
ALTER TABLE "study_card" RENAME COLUMN "user_deck_id" TO "study_deck_id";--> statement-breakpoint
ALTER TABLE "study_card" DROP CONSTRAINT "study_card_user_deck_id_user_deck_id_fk";
--> statement-breakpoint
ALTER TABLE "study_deck" DROP CONSTRAINT "user_deck_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "study_deck" DROP CONSTRAINT "user_deck_deck_id_deck_id_fk";
--> statement-breakpoint
ALTER TABLE "study_deck" ADD COLUMN "new_cards_limit" integer DEFAULT 10 NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "study_card" ADD CONSTRAINT "study_card_study_deck_id_study_deck_id_fk" FOREIGN KEY ("study_deck_id") REFERENCES "study_deck"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "study_deck" ADD CONSTRAINT "study_deck_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "study_deck" ADD CONSTRAINT "study_deck_deck_id_deck_id_fk" FOREIGN KEY ("deck_id") REFERENCES "deck"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
