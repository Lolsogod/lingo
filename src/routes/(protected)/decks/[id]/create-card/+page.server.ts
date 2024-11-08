import { isUUID } from '$lib/_helpers/isUIID';
import { createCardSchema } from '$lib/config/zod-schemas';
import { addCardToDeck, createCard } from '$lib/server/database/models/card';
import { fail } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { LayoutServerLoad } from '../$types';

export const load = (async (event) => {
	const form = await superValidate(event, zod(createCardSchema));
	return { form };
}) satisfies LayoutServerLoad;
//сделать единай экшн для добавления карты? хотя и так норм
export const actions = {
	addCard: async (event) => {
		const deckId = event.params.id;
		const userId = event.locals.user?.id;
		const addCardform = await superValidate(event, zod(createCardSchema));
		if (!addCardform.valid || !userId || !isUUID(deckId)) {
			return fail(400, {
				addCardform
			});
		}
		try {
			//транзакцией?
			const newCard = await createCard(addCardform.data, userId);
			const newCardDeck = await addCardToDeck(deckId, newCard.id);
			if (newCard && newCardDeck) {
				setFlash({ type: 'success', message: 'Карта создана и добавленна в колоду' }, event);
			}
		} catch (e) {
			console.error(e);
			setFlash({ type: 'error', message: 'Не удалось создать карту' }, event);
			return setError(addCardform, 'blocks._errors', 'ошибка наверное');
		}
		return { addCardform };
	}
};
