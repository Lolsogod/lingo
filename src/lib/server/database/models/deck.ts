import { isUUID } from '$lib/_helpers/isUIID';
import db from '$lib/server/database/drizzle';
import {
	cardDeckTable,
	deckLikeTable,
	deckTable,
	studyCardTable,
	studyDeckTable
} from '$lib/server/database/schema';
import type { Deck, NewDeck } from '$lib/server/database/schema';
import { and, eq, ne, or } from 'drizzle-orm';
import { createStudyCard } from '$lib/srs';

export const createDeck = async (data: NewDeck) => {
	const result = await db.insert(deckTable).values(data).onConflictDoNothing().returning();
	if (result.length === 0) {
		return null;
	}
	return result[0];
};

export const updateDeck = async (data: Partial<Deck>, userId: string) => {
	const result = await db
		.update(deckTable)
		.set(data)
		.where(and(eq(deckTable.id, data.id!), eq(deckTable.authorId, userId)))
		.returning();
	if (result.length === 0) {
		return null;
	}
	return result[0];
};
//без колод пользователя
export const getPublicDecks = async (authorId = ''): Promise<NewDeck[] | null> => {
	const decks = await db
		.select()
		.from(deckTable)
		.where(
			and(eq(deckTable.public, true), ne(deckTable.authorId, authorId), ne(deckTable.deleted, true))
		);
	if (decks.length === 0) {
		return null;
	}
	return decks;
};

export const getDecksByAuthor = async (authorId?: string) => {
	if (!authorId) {
		return null;
	}
	const decks = await db
		.select()
		.from(deckTable)
		.where(and(eq(deckTable.authorId, authorId), ne(deckTable.deleted, true)));
	if (decks.length === 0) {
		return null;
	}
	return decks;
};

export const getDeckById = async (id: string, userId = '') => {
	if (!isUUID(id)) {
		return null;
	}
	const foundDeck = await db.query.deckTable.findFirst({
		where: and(
			eq(deckTable.id, id),
			or(eq(deckTable.authorId, userId), eq(deckTable.public, true)),
			ne(deckTable.deleted, true)
		),
		with: { studyDecks: true }
	});
	return foundDeck;
};

export const addDeckToUser = async (userId: string, deckId: string) => {
	await db.transaction(async (tx) => {
		const result = await tx
			.insert(studyDeckTable)
			.values({ userId, deckId })
			.onConflictDoNothing()
			.returning();
		const cards = await tx.query.cardDeckTable.findMany({
			where: eq(cardDeckTable.deckId, deckId)
		});
		cards.forEach(async (cardDeck) => {
			const newCard = createStudyCard(cardDeck.cardId, result[0].id);
			await tx.insert(studyCardTable).values(newCard).returning();
		});
	});
	return true; // временно
};

export const getStudyDecks = async (userId: string) => {
	const decks = await db.query.studyDeckTable.findMany({
		where: eq(studyDeckTable.userId, userId),
		with: { deck: true, studyCards: true }
	});
	return decks;
};
//cделать чтоб удалялась полностью при отсутсвии стади деков
export const softDeleteDeck = async (deckId: string, userId: string) => {
	const result = await db
		.update(deckTable)
		.set({ deleted: true })
		.where(and(eq(deckTable.id, deckId), eq(deckTable.authorId, userId)))
		.returning();
	return result;
};

//likes
export const addLike = async (userId: string, deckId: string) => {
	const existingLike = await db.query.deckLikeTable.findFirst({
		where: and(eq(deckLikeTable.userId, userId), eq(deckLikeTable.deckId, deckId))
	});

	let result;
	if (existingLike) {
		result = await db
			.update(deckLikeTable)
			.set({ liked: !existingLike.liked })
			.where(and(eq(deckLikeTable.userId, userId), eq(deckLikeTable.deckId, deckId)))
			.returning();
	} else {
		result = await db.insert(deckLikeTable).values({ userId, deckId, liked: true }).returning();
	}

	return result;
};

export const addDislike = async (userId: string, deckId: string) => {
	const existingDislike = await db.query.deckLikeTable.findFirst({
		where: and(eq(deckLikeTable.userId, userId), eq(deckLikeTable.deckId, deckId))
	});

	let result;
	if (existingDislike) {
		result = await db
			.update(deckLikeTable)
			.set({ liked: !existingDislike.liked })
			.where(and(eq(deckLikeTable.userId, userId), eq(deckLikeTable.deckId, deckId)))
			.returning();
	} else {
		result = await db.insert(deckLikeTable).values({ userId, deckId, liked: false }).returning();
	}

	return result;
};

export const removeLike = async (userId: string, deckId: string) => {
	const result = await db
		.delete(deckLikeTable)
		.where(and(eq(deckLikeTable.userId, userId), eq(deckLikeTable.deckId, deckId)))
		.returning();
	return result;
};

export const getLikesDislikes = async (deckId: string) => {
	const likes = await db.query.deckLikeTable.findMany({
		where: and(eq(deckLikeTable.deckId, deckId), eq(deckLikeTable.liked, true))
	});
	const dislikes = await db.query.deckLikeTable.findMany({
		where: and(eq(deckLikeTable.deckId, deckId), eq(deckLikeTable.liked, false))
	});
	const rating = likes.length - dislikes.length;
	return { likes, dislikes, rating };
};

export const getUsersLikeStatusForDeck = async (deckId: string, userId: string) => {
	const likeStatus = await db.query.deckLikeTable.findFirst({
		where: and(eq(deckLikeTable.deckId, deckId), eq(deckLikeTable.userId, userId))
	});
	return likeStatus;
};

//get deck tags
export const getDeckTags = async (deckId: string) => {
	const tags = await db.query.cardDeckTable.findMany({
		where: eq(cardDeckTable.deckId, deckId),
		with: { card: true }
	});

	const deckTags = tags.flatMap((tag) => tag.card.tags);
	return Array.from(new Set(deckTags));
};
//deck level
export const getAverageDeckLevel = async (deckId: string): Promise<number | null> => {
	const cards = await db.query.cardDeckTable.findMany({
		where: eq(cardDeckTable.deckId, deckId),
		with: { card: true }
	});

	if (cards.length === 0) {
		return null;
	}

	const totalLevel = cards.reduce((sum, cardDeck) => sum + cardDeck.card.level, 0);
	const averageLevel = totalLevel / cards.length;
	
	return averageLevel;
};