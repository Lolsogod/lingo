DO $$ BEGIN
 ALTER TABLE "review_log" ADD CONSTRAINT "review_log_card_id_study_card_id_fk" FOREIGN KEY ("card_id") REFERENCES "study_card"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
