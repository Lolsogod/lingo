CREATE TABLE IF NOT EXISTS "review_log" (
	"id" text PRIMARY KEY NOT NULL,
	"card_id" text NOT NULL,
	"ratings" "ratings" NOT NULL,
	"states" "states" NOT NULL,
	"due" timestamp NOT NULL,
	"stability" real NOT NULL,
	"difficulty" real NOT NULL,
	"elapsed_days" integer NOT NULL,
	"last_elapsed_days" integer NOT NULL,
	"scheduled_days" integer NOT NULL,
	"review" timestamp NOT NULL,
	"duration" integer DEFAULT 0 NOT NULL,
	"deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "study_card" RENAME COLUMN "state" TO "states";