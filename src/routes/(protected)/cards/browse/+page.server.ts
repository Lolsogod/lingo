import { getCardsByAuthor, getPublicCards } from '$lib/server/database/models/card';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
	const user = event.locals.user;
	const publicCards = await getPublicCards(user?.id);
	const userCreatedCards = await getCardsByAuthor(user?.id);
	return { publicCards, userCreatedCards };
}) satisfies PageServerLoad;
