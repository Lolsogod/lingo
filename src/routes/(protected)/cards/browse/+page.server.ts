import { createCardIndex, searchCardsIndex } from '$lib/cardSearch';
import { getCardsByAuthor, getPublicCards } from '$lib/server/database/models/card';
import type { CardExp } from '$lib/server/database/schema';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
	const user = event.locals.user;
	const query = event.url.searchParams.get('q') || null;
	let publicCards: CardExp[] | null = await getPublicCards(user?.id);
	let userCreatedCards: CardExp[] | null = await getCardsByAuthor(user?.id);
	console.log(query);
	if (query) {
		if (publicCards) {
			const index = createCardIndex(publicCards);
			publicCards = searchCardsIndex(query, index, publicCards);
		}
		if (userCreatedCards) {
			const index = createCardIndex(userCreatedCards);
			userCreatedCards = searchCardsIndex(query, index, userCreatedCards);
		}
	}
	return { publicCards, userCreatedCards };
}) satisfies PageServerLoad;
