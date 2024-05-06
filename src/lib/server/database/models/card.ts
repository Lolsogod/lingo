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
	studyCardTable,
	type CardExp,
	type Block
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
		const newBlocks = data.blocks.filter((block) => block.isNew);
		const existingBlocks = data.blocks.filter((block) => !block.isNew);

		let blocks: Block[] = [];
		if (newBlocks.length > 0) {
			blocks = await tx
				.insert(blockTable)
				.values(newBlocks.map((block) => ({ ...block, isNew: undefined, id: undefined })))
				.onConflictDoNothing()
				.returning();
		}
		const newCard = (
			await tx
				.insert(cardTable)
				.values({
					topicId: existingTopic.id,
					authorId
				})
				.returning()
		)[0];
		if (blocks.length > 0) {
			await tx.insert(cardBlockTable).values(
				blocks.map((block) => ({
					cardId: newCard.id,
					blockId: block.id
				}))
			);
		}
		if (existingBlocks.length > 0) {
			await tx.insert(cardBlockTable).values(
				existingBlocks.map((block) => ({
					cardId: newCard.id,
					blockId: block.id!
				}))
			);
		}
		return newCard;
	});
	return result;
};
//добавить чекать публичность
export const addCardToDeck = async (deckId: string, cardId: string) => {
	const result = await db.transaction(async (tx) => {
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

export const getPublicCards = async (userId = ''): Promise<CardExp[] | null> => {
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

export const findBlocks = async (topicName: string) => {
	const blocks = await db
		.selectDistinct({ id: blockTable.id, content: blockTable.content, type: blockTable.type })
		.from(blockTable)
		.innerJoin(cardBlockTable, eq(blockTable.id, cardBlockTable.blockId))
		.innerJoin(cardTable, eq(cardBlockTable.cardId, cardTable.id))
		.innerJoin(topicTable, eq(cardTable.topicId, topicTable.id))
		.where(eq(topicTable.name, topicName))
		.execute();

	return blocks;
};
