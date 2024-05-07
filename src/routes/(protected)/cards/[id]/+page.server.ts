import { addCardToDeck, getCardById } from '$lib/server/database/models/card';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDecksByAuthor } from '$lib/server/database/models/deck';
import { fail, superValidate } from 'sveltekit-superforms';
import { addCardToDeckSchema2 } from '$lib/config/zod-schemas';
import { zod } from 'sveltekit-superforms/adapters';
import { setFlash } from 'sveltekit-flash-message/server';

export const load = (async (event) => {
	const cardId = event.params.id;
	const user = event.locals.user;
	const card = await getCardById(cardId);
	if (!card) {
		error(404, 'Card not found');
	}
	const avgDiff = (
		card.studyCard.reduce((acc, card) => acc + card.difficulty, 0) / card.studyCard.length
	).toFixed(1);

	const decks = await getDecksByAuthor(user?.id);
	const addToDeckForm = await superValidate(event, zod(addCardToDeckSchema2));

	return { card, avgDiff, decks, addToDeckForm };
}) satisfies PageServerLoad;

export const actions = {
	default: async (event) => {
		const userId = event.locals.user?.id;
		const cardId = event.params.id;
		const form = await superValidate(event, zod(addCardToDeckSchema2));

		if (!form.valid || !userId) {
			setFlash({ type: 'error', message: 'Не удалось создать карту' }, event);
			return fail(400, {
				form
			});
		}
		const result = await addCardToDeck(form.data.deckId, cardId);
		if (result) {
			setFlash({ type: 'success', message: 'Добавленна в колоду' }, event);
		}

		return { form };
	}
};
