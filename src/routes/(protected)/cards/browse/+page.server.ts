import { createCardIndex, searchCardsIndex } from '$lib/cardSearch';
import { getCardsByAuthor, getPublicCards } from '$lib/server/database/models/card';
import { getRecommendedDifficulty } from '$lib/server/database/models/user';
import type { CardExp } from '$lib/server/database/schema';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
	const user = event.locals.user;
	const recommendedDifficulty = await getRecommendedDifficulty(user!.id);

	const query = event.url.searchParams.get('q') || null;
	const tagQuery =
		event.url.searchParams
			.get('tag')
			?.split(',')
			.map((tag) => tag.trim())
			.filter((tag) => tag !== '') || null;

	let publicCards: CardExp[] | null = await getPublicCards(user?.id);
	let userCreatedCards: CardExp[] | null = await getCardsByAuthor(user?.id);

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

	if (tagQuery) {
		console.log(tagQuery);
		const filterByTags = (cards: CardExp[] | null, tags: string[]) => {
			return cards?.filter((card) => tags.every((tag) => card.tags.includes(tag))) || null;
		};

		publicCards = filterByTags(publicCards, tagQuery);
		userCreatedCards = filterByTags(userCreatedCards, tagQuery);
	}
	return { publicCards, userCreatedCards, recommendedDifficulty };
}) satisfies PageServerLoad;
