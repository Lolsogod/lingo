import db from "$lib/server/database/drizzle";
import type { CreateCardSchema } from "$lib/config/zod-schemas";
import { eq } from "drizzle-orm";
import { block, card, cardBlock, topic } from "./drizzle-schemas";

export const findTopicByName = async (name: string) => {
	const foundTopic = await db.query.topic.findFirst({
		where: eq(topic.content, name),
	});
	return foundTopic;
};

export const createCard = async (data: CreateCardSchema) => {
	let existingTopic = await findTopicByName(data.topicName);
	if (!existingTopic) {
		existingTopic = (
			await db.insert(topic).values({ content: data.topicName }).returning()
		)[0];
	}
	const blocks = await db
		.insert(block)
		.values(data.blocks)
		.onConflictDoNothing()
		.returning();
    
    const newCard = (await db.insert(card).values({
        topicId: existingTopic.id,
    }).returning())[0];

    const cardBlocks = await db.insert(cardBlock).values(
        blocks.map((block) => ({
            cardId: newCard.id,
            blockId: block.id,
        }))
    )
    return true
};
