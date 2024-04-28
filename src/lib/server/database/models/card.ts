import type { CreateCardSchema } from '$lib/config/zod-schemas';
import db from '$lib/server/database/drizzle';
import { and, eq, ne } from 'drizzle-orm';
import {
	blockTable,
	cardTable,
	cardBlockTable,
	cardDeckTable,
	topicTable,
	studyDeckTable,
	studyCardTable
} from '../schema';
import { createStudyCard } from '$lib/fsrs';

export const findTopicByName = async (name: string) => {
	const foundTopic = await db.query.topicTable.findFirst({
		where: eq(topicTable.name, name)
	});
	return foundTopic;
};

export const createCard = async (data: CreateCardSchema, authorId: string) => {
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
					topicId: existingTopic.id,
					authorId
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
//добавить синхронизацию и чекать публичность
export const addCardToDeck = async (deckId: string, cardId: string) => {
	await db.transaction(async (tx) => {
		const result = await tx
			.insert(cardDeckTable)
			.values({ deckId, cardId })
			.onConflictDoNothing()
			.returning();
		const studyDecks = await tx.query.studyDeckTable.findMany({
			where: eq(studyDeckTable.deckId, deckId)
		});
		studyDecks.forEach(async (studyDeck) => {
			const newCard = createStudyCard(result[0].cardId, studyDeck.id);
			await tx.insert(studyCardTable).values(newCard).returning();
		});
		return result;
	});
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

export const getPublicCards = async (userId = '') => {
	const cards = await db.query.cardTable.findMany({
		where: and(eq(cardTable.public, true), ne(cardTable.authorId, userId)),
		with: { topic: true, cardDeck: true }
	});
	if (cards.length === 0) {
		return null;
	}
	return cards;
};
export const getCardsByAuthor = async (authorId?: string) => {
	if (!authorId) {
		return null;
	}
	const cards = await db.query.cardTable.findMany({
		where: eq(cardTable.authorId, authorId),
		with: { topic: true, cardDeck: true } //а пока костылина! add some processomg to check if it is inside deck
	});
	if (cards.length === 0) {
		return null;
	}
	return cards;
};
