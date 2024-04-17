import { isUUID } from '$lib/_helpers/isUIID';
import { createCardSchema, startStudySchema } from '$lib/config/zod-schemas';
import { addCardToDeck, createCard, getCardsByDeckId } from '$lib/server/database/models/card';
import { addDeckToUser, getDeckById } from '$lib/server/database/models/deck';
import { error, fail } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
	const user = event.locals.user;
	const deckId = event.params.id;

	const deck = await getDeckById(deckId, user?.id);
	if (!deck) {
		return error(404, 'Deck not found');
	}
	const addCardForm = await superValidate(event, zod(createCardSchema));
	const startStudyForm = await superValidate(event, zod(startStudySchema));
	const cards = await getCardsByDeckId(deckId);
	const alredyStudying = deck.userDecks.some((ud) => ud.userId === user?.id); //кривые структуры как то в порядок преводить на этапе модели например дека
	return { addCardForm, startStudyForm, deck, cards, alredyStudying };
}) satisfies PageServerLoad;

// код повторяется пофиксить
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
		//add card to db
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
	},
	//нужна ли тут суперформа?
	addToUser: async (event) => {
		const startStudyForm = await superValidate(event, zod(startStudySchema));
		if (!startStudyForm.valid) {
			return fail(400, {
				startStudyForm
			});
		}
		const deckId = event.params.id;
		const userId = event.locals.user?.id;
		if (!userId || !isUUID(deckId)) {
			return fail(400, {});
		}
		try {
			const result = await addDeckToUser(userId, deckId);
			if (result) {
				setFlash({ type: 'success', message: 'Колода добавлена в обучение' }, event);
			}
		} catch (e) {
			console.error(e);
			setFlash({ type: 'error', message: 'Не удалось добавить к обучению' }, event);
			return setError(startStudyForm, 'addToStudy', 'ошибка наверное');
		}

		return { startStudyForm };
	}
};
