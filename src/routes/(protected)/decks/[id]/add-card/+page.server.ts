import { addCardToDeckSchema } from '$lib/config/zod-schemas';
import { addCardToDeck, getCardsByAuthor, getPublicCards } from '$lib/server/database/models/card';
import { superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { isUUID } from '$lib/_helpers/isUIID';
import type { CardWithTopic } from '$lib/server/database/schema';
//move this to sql... but later... i hate sql..
const addedCheck = (cards: CardWithTopic[] | null, deckId: string) => {
	if (cards) {
		cards.forEach((card) => {
			card.isAdded = card.deck!.some((deck) => deck.deckId === deckId);
		});
	}
};

export const load = (async (event) => {
	const user = event.locals.user;
	const deckId = event.params.id;

	const publicCards: CardWithTopic[] | null = await getPublicCards(user?.id);
	const userCreatedCards: CardWithTopic[] | null = await getCardsByAuthor(user?.id);

	const form = await superValidate(event, zod(addCardToDeckSchema));

	addedCheck(publicCards, deckId);
	addedCheck(userCreatedCards, deckId);
	return { publicCards, userCreatedCards, form };
}) satisfies PageServerLoad;
//добавляется только первая, наверное изза ебучих суперформсов
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
