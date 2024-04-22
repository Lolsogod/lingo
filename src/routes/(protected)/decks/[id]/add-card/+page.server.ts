import { addCardToDeckSchema } from '$lib/config/zod-schemas';
import { addCardToDeck, getCardsByAuthor, getPublicCards } from '$lib/server/database/models/card';
import { superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { isUUID } from '$lib/_helpers/isUIID';

export const load = (async (event) => {
	const user = event.locals.user;
	const publicCards = await getPublicCards(user?.id);
	const userCreatedCards = await getCardsByAuthor(user?.id);

	const form = await superValidate(event, zod(addCardToDeckSchema));
	const added = false;
	return { publicCards, userCreatedCards, form, added };
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
