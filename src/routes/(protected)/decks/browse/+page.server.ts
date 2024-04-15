import {
	getDecksByAuthor,
	getPublicDecks,
} from "$lib/server/database/deck-model";
import type { PageServerLoad } from "./$types";

export const load = (async (event) => {
	const user = event.locals.user;
	const publicDecks = await getPublicDecks(user?.id);
	const userCreatedDecks = await getDecksByAuthor(user?.id);
	return { publicDecks, userCreatedDecks };
}) satisfies PageServerLoad;
