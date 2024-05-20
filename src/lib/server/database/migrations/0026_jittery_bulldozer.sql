CREATE TABLE IF NOT EXISTS "block_like" (
	"user_id" text NOT NULL,
	"block_id" uuid NOT NULL,
	"liked" boolean NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "block_like_user_id_block_id_pk" PRIMARY KEY("user_id","block_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "block_like" ADD CONSTRAINT "block_like_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "block_like" ADD CONSTRAINT "block_like_block_id_block_id_fk" FOREIGN KEY ("block_id") REFERENCES "public"."block"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
