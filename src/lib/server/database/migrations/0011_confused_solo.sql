DO $$ BEGIN
 CREATE TYPE "ratings" AS ENUM('Manual', 'Again', 'Hard', 'Good', 'Easy');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "states" AS ENUM('New', 'Learning', 'Review', 'Relearning');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "study_card" ALTER COLUMN "state" SET DATA TYPE states;