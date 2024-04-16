import { isUUID } from "$lib/_helpers/isUIID";
import db from "$lib/server/database/drizzle";
import { deck, userDeck } from "$lib/server/database/drizzle-schemas";
import type { Deck } from "$lib/server/database/drizzle-schemas";
import { and, eq, ne, or } from "drizzle-orm";

export const createDeck = async (data: Deck) => {
	const result = await db
		.insert(deck)
		.values(data)
		.onConflictDoNothing()
		.returning();
	if (result.length === 0) {
		return null;
	}
	return result[0];
};

export const getPublicDecks = async (authorId = ""): Promise<Deck[] | null> => {
	const decks = await db
		.select()
		.from(deck)
		.where(and(eq(deck.public, true), ne(deck.authorId, authorId)));
	if (decks.length === 0) {
		return null;
	}
	return decks;
};

export const getDecksByAuthor = async (authorId?: string) => {
	if (!authorId) {
		return null;
	}
	const decks = await db.select().from(deck).where(eq(deck.authorId, authorId));
	if (decks.length === 0) {
		return null;
	}
	return decks;
};

export const getDeckById = async (id: string, userId = "") => {
	if (!isUUID(id)) {
		return null;
	}
	const foundDeck = await db
		.select()
		.from(deck)
		.where(
			and(
				eq(deck.id, id),
				or(eq(deck.authorId, userId), eq(deck.public, true)),
			),
		);
	if (foundDeck.length === 0) {
		return null;
	}
	return foundDeck[0];
};

export const addDeckToUser = async (userId: string, deckId: string) => {
	const result = await db
		.insert(userDeck)
		.values({ userId, deckId })
		.onConflictDoNothing()
		.returning();
	return result;
};

export const getStudyDecks = async (userId: string) => {
	const decks = await db.query.userDeck.findMany({
		where: eq(userDeck.userId, userId),
		with: { deck: true },
	});
	return decks;
};
