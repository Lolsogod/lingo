import type { CreateCardSchema } from '$lib/config/zod-schemas';
import db from '$lib/server/database/drizzle';
import { eq } from 'drizzle-orm';
import { blockTable, cardTable, cardBlockTable, cardDeckTable, topicTable } from '../schema';

export const findTopicByName = async (name: string) => {
	const foundTopic = await db.query.topicTable.findFirst({
		where: eq(topicTable.name, name)
	});
	return foundTopic;
};

export const createCard = async (data: CreateCardSchema) => {
	let existingTopic = await findTopicByName(data.topicName);
	const result = await db.transaction(async (tx) => {
		if (!existingTopic) {
			existingTopic = (await tx.insert(topicTable).values({ name: data.topicName }).returning())[0];
		}
		const blocks = await tx
			.insert(blockTable)
			.values(data.blocks)
			.onConflictDoNothing()
			.returning();

		const newCard = (
			await tx
				.insert(cardTable)
				.values({
					topicId: existingTopic.id
				})
				.returning()
		)[0];

		await tx.insert(cardBlockTable).values(
			blocks.map((block) => ({
				cardId: newCard.id,
				blockId: block.id
			}))
		);
		return newCard;
	});
	return result;
};

export const addCardToDeck = async (deckId: string, cardId: string) => {
	const result = await db
		.insert(cardDeckTable)
		.values({ deckId, cardId })
		.onConflictDoNothing()
		.returning();
	return result;
};

export const getCardsByDeckId = async (deckId: string) => {
	const cardDecks = await db.query.cardDeckTable.findMany({
		where: eq(cardDeckTable.deckId, deckId),
		with: {
			card: { with: { topic: true } }
		}
	});
	return cardDecks.map((cardDecks) => cardDecks.card);
};
