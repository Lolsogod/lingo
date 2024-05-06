import type { PageServerLoad } from './$types';
import { createCardSchema } from '$lib/config/zod-schemas';
import { addCardToDeck, createCard, findBlocks } from '$lib/server/database/models/card';
import { fail, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { createCardIndex, searchCardsIndex } from '$lib/cardSearch';
import { getCardsByAuthor, getPublicCards } from '$lib/server/database/models/card';
import type { CardExp } from '$lib/server/database/schema';

export const load = (async (event) => {
	const topic = event.url.searchParams.get('topic') || '';
	const user = event.locals.user;

	const publicCards: CardExp[] | null = await getPublicCards(user?.id);
	const userCreatedCards: CardExp[] | null = await getCardsByAuthor(user?.id);
	let relatedCards: CardExp[] = [];
	if (topic) {
		relatedCards = [...(publicCards || []), ...(userCreatedCards || [])];
		if (relatedCards) {
			const index = createCardIndex(relatedCards);
			relatedCards = searchCardsIndex(topic, index, relatedCards);
		}
	}

	const blocks = await findBlocks(topic);

	return { relatedCards, blocks };
}) satisfies PageServerLoad;

export const actions = {
	default: async (event) => {
		const userId = event.locals.user?.id;
		const form = await superValidate(event, zod(createCardSchema));

		if (!form.valid || !userId) {
			setFlash({ type: 'error', message: 'Не удалось создать карту' }, event);
			return fail(400, {
				form
			});
		}
		//add card to db
		try {
			const newCard = await createCard(form.data, userId);
			if (newCard) {
				setFlash({ type: 'success', message: 'Карта создана' }, event);
				if (form.data.addToStudy && form.data.studyDeckId) {
					const result = await addCardToDeck(form.data.studyDeckId, newCard.id);
					if (result) {
						setFlash({ type: 'success', message: 'Добавленна в колоду' }, event);
					}
				}
			}
		} catch (e) {
			console.error(e);
			setFlash({ type: 'error', message: 'Не удалось создать карту' }, event);
			return setError(form, 'blocks._errors', 'ошибка наверное');
		}
		console.log(form);
		redirect(302, '/cards/browse'); //редирект на пустую форму без топика сделать бы
		//вобще не понимаю что тут проиходит когда пытаешься остаться на странице
		//поэтому редирект
	}
};
