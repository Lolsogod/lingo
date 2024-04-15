import type { CreateCardSchema } from "$lib/config/zod-schemas";
import db from "$lib/server/database/drizzle";
import { eq } from "drizzle-orm";
import { block, card, cardBlock, cardDeck, topic } from "./drizzle-schemas";

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
	//транзакциями поидее бы надо сделать
	const blocks = await db
		.insert(block)
		.values(data.blocks)
		.onConflictDoNothing()
		.returning();

	const newCard = (
		await db
			.insert(card)
			.values({
				topicId: existingTopic.id,
			})
			.returning()
	)[0];

	const cardBlocks = await db.insert(cardBlock).values(
		blocks.map((block) => ({
			cardId: newCard.id,
			blockId: block.id,
		})),
	);
	return newCard;
};

export const addCardToDeck = async (deckId: string, cardId: string) => {
	const result = await db
		.insert(cardDeck)
		.values({ deckId, cardId })
		.onConflictDoNothing()
		.returning();
	return result;
};

export const getCardsByDeckId = async (deckId: string) => {
	const cardDecks = await db.query.cardDeck.findMany({
		where: eq(cardDeck.deckId, deckId),
		with: {
			card: { with: { topic: true } },
		},
	});
	return cardDecks.map((cardDecks) => cardDecks.card);
};
