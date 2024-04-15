import db from "$lib/server/database/drizzle";
import { deck } from "$lib/server/database/drizzle-schemas";
import type { Deck } from "$lib/server/database/drizzle-schemas";


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
