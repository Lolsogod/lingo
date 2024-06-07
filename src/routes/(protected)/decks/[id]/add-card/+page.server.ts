import { addCardToDeckSchema } from '$lib/config/zod-schemas';
import { addCardToDeck, getCardsByAuthor, getPublicCards } from '$lib/server/database/models/card';
import { superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { isUUID } from '$lib/_helpers/isUIID';
import type { CardExp } from '$lib/server/database/schema';
import { createCardIndex, searchCardsIndex } from '$lib/cardSearch';
//move this to sql... but later... i hate sql..
const addedCheck = (cards: CardExp[] | null, deckId: string) => {
	if (cards) {
		cards.forEach((card) => {
			card.isAdded = card.cardDeck!.some((deck) => deck.deckId === deckId);
		});
	}
};

export const load = (async (event) => {
	const user = event.locals.user;
	const deckId = event.params.id;
	const query = event.url.searchParams.get('add') || null;
	const tagQuery =
	event.url.searchParams
		.get('add-tag')
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
	const form = await superValidate(event, zod(addCardToDeckSchema));

	addedCheck(publicCards, deckId);
	addedCheck(userCreatedCards, deckId);
	return { publicCards, userCreatedCards, form };
}) satisfies PageServerLoad;

export const actions = {
	default: async (event) => {
		const deckId = event.params.id;
		const form = await superValidate(event, zod(addCardToDeckSchema));
		console.log(form.data.cardId, deckId);
		console.log(isUUID(deckId), isUUID(form.data.cardId));
		await addCardToDeck(deckId, form.data.cardId);
		return { form };
	}
};
