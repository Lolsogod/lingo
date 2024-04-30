ALTER TABLE "review_log" DROP CONSTRAINT "review_log_card_id_study_card_id_fk";
--> statement-breakpoint
ALTER TABLE "study_card" DROP CONSTRAINT "study_card_study_deck_id_study_deck_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "review_log" ADD CONSTRAINT "review_log_card_id_study_card_id_fk" FOREIGN KEY ("card_id") REFERENCES "study_card"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "study_card" ADD CONSTRAINT "study_card_study_deck_id_study_deck_id_fk" FOREIGN KEY ("study_deck_id") REFERENCES "study_deck"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
