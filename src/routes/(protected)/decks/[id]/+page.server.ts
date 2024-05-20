import { isUUID } from '$lib/_helpers/isUIID';
import { deleteDeckSchema, likeSchema, startStudySchema } from '$lib/config/zod-schemas';
import {
	addDeckToUser,
	addDislike,
	addLike,
	removeLike,
	softDeleteDeck
} from '$lib/server/database/models/deck';
import { fail, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

// код повторяется пофиксить
export const actions = {
	//нужна ли тут суперформа?
	startStudy: async (event) => {
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
	},
	delete: async (event) => {
		const deckId = event.params.id;
		const deleteDeckForm = await superValidate(event, zod(deleteDeckSchema));
		const userId = event.locals.user?.id;
		if (!userId || !isUUID(deckId)) {
			return fail(400, {});
		}

		await softDeleteDeck(deckId, userId);

		redirect(302, '/decks/browse');
	},
	rate: async (event) => {
		const userId = event.locals.user?.id;
		const deckId = event.params.id;
		const likeForm = await superValidate(event, zod(likeSchema));
		if (!likeForm.valid || !userId || !deckId) {
			return fail(400, {
				likeForm
			});
		}
		const { liked } = likeForm.data;
		if (liked) {
			await addLike(userId, deckId);
		} else {
			await addDislike(userId, deckId);
		}
	}, 
	unrate: async (event) => {
		const userId = event.locals.user?.id;
		const deckId = event.params.id;

		if (!userId || !deckId) {
			return fail(400);
		}
		await removeLike(userId, deckId);
	}
};
