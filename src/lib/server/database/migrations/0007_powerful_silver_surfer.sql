ALTER TABLE "topic" RENAME COLUMN "content" TO "name";--> statement-breakpoint
ALTER TABLE "topic" DROP CONSTRAINT "topic_content_unique";--> statement-breakpoint
ALTER TABLE "card_block" ADD CONSTRAINT "card_block_card_id_block_id_pk" PRIMARY KEY("card_id","block_id");--> statement-breakpoint
ALTER TABLE "user_deck" ADD CONSTRAINT "user_deck_user_id_deck_id_pk" PRIMARY KEY("user_id","deck_id");--> statement-breakpoint
ALTER TABLE "topic" ADD CONSTRAINT "topic_name_unique" UNIQUE("name");