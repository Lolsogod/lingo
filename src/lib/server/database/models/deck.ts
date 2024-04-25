import { isUUID } from '$lib/_helpers/isUIID';
import db from '$lib/server/database/drizzle';
import {
	cardDeckTable,
	deckTable,
	studyCardTable,
	userDeckTable
} from '$lib/server/database/schema';
import type { Deck } from '$lib/server/database/schema';
import { and, eq, ne, or } from 'drizzle-orm';
import { createStudyCard } from './study';

export const createDeck = async (data: Deck) => {
	const result = await db.insert(deckTable).values(data).onConflictDoNothing().returning();
	if (result.length === 0) {
		return null;
	}
	return result[0];
};

export const getPublicDecks = async (authorId = ''): Promise<Deck[] | null> => {
	const decks = await db
		.select()
		.from(deckTable)
		.where(and(eq(deckTable.public, true), ne(deckTable.authorId, authorId)));
	if (decks.length === 0) {
		return null;
	}
	return decks;
};

export const getDecksByAuthor = async (authorId?: string) => {
	if (!authorId) {
		return null;
	}
	const decks = await db.select().from(deckTable).where(eq(deckTable.authorId, authorId));
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
			or(eq(deckTable.authorId, userId), eq(deckTable.public, true))
		),
		with: { userDecks: true }
	});
	return foundDeck;
};

export const addDeckToUser = async (userId: string, deckId: string) => {
	await db.transaction(async (tx) => {
		const result = await tx
			.insert(userDeckTable)
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
	const decks = await db.query.userDeckTable.findMany({
		where: eq(userDeckTable.userId, userId),
		with: { deck: true, studyCards: true }
	});
	return decks;
};
