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
	type Block,
	blockLikeTable,
	type Topic
} from '../schema';
import { createStudyCard } from '$lib/srs';

export const findTopicByName = async (name: string) => {
	const foundTopic = await db.query.topicTable.findFirst({
		where: eq(topicTable.name, name)
	});
	if (!foundTopic) {
		return null;
	}
	return foundTopic;
};

export const createCard = async (data: CreateCardSchema, authorId: string) => {
	let existingTopic = await findTopicByName(data.topicName);
	const result = await db.transaction(async (tx) => {
		if (!existingTopic) {
			existingTopic = (await tx.insert(topicTable).values({ name: data.topicName }).returning())[0];
			if (!existingTopic) {
				throw new Error('Topic not found');
			}
		}
		const newBlocks = data.blocks.filter((block) => block.isNew);
		const existingBlocks = data.blocks.filter((block) => !block.isNew);

		let blocks: Block[] = [];
		if (newBlocks.length > 0) {
			blocks = await tx
				.insert(blockTable)
				.values(
					newBlocks.map((block) => ({
						...block,
						isNew: undefined,
						id: undefined,
						topicId: existingTopic!.id
					}))
				)
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

export const findBlockByTopic = async (topicName: string) => {
	const topic = await db.query.topicTable.findFirst({
		where: eq(topicTable.name, topicName)
	});
	if (!topic) {
		return [];
	}
	const blocks = await db.query.blockTable.findMany({
		where: eq(blockTable.topicId, topic.id)
	});
	return blocks;
};
export const getCardById = async (cardId: string) => {
	const card = await db.query.cardTable.findFirst({
		where: eq(cardTable.id, cardId),
		with: { topic: true, cardDeck: true, cardBlocks: { with: { block: true } }, studyCard: true }
	});

	return card;
};

export const createComment = async (
	topicId: string,
	content: string,
	potentialTopicName: string,
	authorId: string,
	type: 'markdown' | 'text' = 'text'
) => {
	let topic: Topic | undefined;
	try {
		topic = await db.query.topicTable.findFirst({
			where: eq(topicTable.id, topicId)
		});
	} catch (error) {
		topic = (await db.insert(topicTable).values({ name: potentialTopicName }).returning())[0];
	}
	if(!topic) {
		return null;
	}
	const result = await db.transaction(async (tx) => {
		const newComment = await tx
			.insert(blockTable)
			.values({ content, type, topicId: topic!.id, authorId })
			.returning();
		return newComment;
	});
	return result;
};

export const getComentsForTopic = async (topicId: string) => {
	const comments = await db.query.blockTable.findMany({
		where: eq(blockTable.topicId, topicId),
		with: { author: true }, //бесопасно ли это...
		orderBy: (comments, { desc }) => [desc(comments.createdAt)]
	});
	return comments;
};

// block likes
export const addBlockLike = async (userId: string, blockId: string) => {
	const existingLike = await db.query.blockLikeTable.findFirst({
		where: and(eq(blockLikeTable.userId, userId), eq(blockLikeTable.blockId, blockId))
	});

	let result;
	if (existingLike) {
		result = await db
			.update(blockLikeTable)
			.set({ liked: !existingLike.liked })
			.where(and(eq(blockLikeTable.userId, userId), eq(blockLikeTable.blockId, blockId)))
			.returning();
	} else {
		result = await db.insert(blockLikeTable).values({ userId, blockId, liked: true }).returning();
	}

	return result;
};

export const addBlockDislike = async (userId: string, blockId: string) => {
	const existingDislike = await db.query.blockLikeTable.findFirst({
		where: and(eq(blockLikeTable.userId, userId), eq(blockLikeTable.blockId, blockId))
	});

	let result;
	if (existingDislike) {
		result = await db
			.update(blockLikeTable)
			.set({ liked: !existingDislike.liked })
			.where(and(eq(blockLikeTable.userId, userId), eq(blockLikeTable.blockId, blockId)))
			.returning();
	} else {
		result = await db.insert(blockLikeTable).values({ userId, blockId, liked: false }).returning();
	}

	return result;
};

export const removeBlockLike = async (userId: string, blockId: string) => {
	const result = await db
		.delete(blockLikeTable)
		.where(and(eq(blockLikeTable.userId, userId), eq(blockLikeTable.blockId, blockId)))
		.returning();
	return result;
};

export const getBlockLikesDislikes = async (blockId: string) => {
	const likes = await db.query.blockLikeTable.findMany({
		where: and(eq(blockLikeTable.blockId, blockId), eq(blockLikeTable.liked, true))
	});
	const dislikes = await db.query.blockLikeTable.findMany({
		where: and(eq(blockLikeTable.blockId, blockId), eq(blockLikeTable.liked, false))
	});
	const rating = likes.length - dislikes.length;
	return { likes, dislikes, rating };
};

export const getUsersLikeStatusForBlock = async (blockId: string, userId: string) => {
	const likeStatus = await db.query.blockLikeTable.findFirst({
		where: and(eq(blockLikeTable.blockId, blockId), eq(blockLikeTable.userId, userId))
	});
	return likeStatus;
};
