CREATE TABLE IF NOT EXISTS "study_card" (
	"user_deck_id" uuid NOT NULL,
	"card_id" uuid NOT NULL,
	"due" timestamp DEFAULT now() NOT NULL,
	"stability" real NOT NULL,
	"difficulty" real NOT NULL,
	"elapsed_days" integer NOT NULL,
	"scheduled_days" integer NOT NULL,
	"reps" integer NOT NULL,
	"lapses" integer NOT NULL,
	"state" text NOT NULL,
	"last_review" timestamp,
	"suspended" timestamp DEFAULT now() NOT NULL,
	"deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_deck" DROP CONSTRAINT "user_deck_user_id_deck_id_pk";--> statement-breakpoint
ALTER TABLE "user_deck" ADD COLUMN "id" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "study_card" ADD CONSTRAINT "study_card_user_deck_id_user_deck_id_fk" FOREIGN KEY ("user_deck_id") REFERENCES "user_deck"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "study_card" ADD CONSTRAINT "study_card_card_id_card_id_fk" FOREIGN KEY ("card_id") REFERENCES "card"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
