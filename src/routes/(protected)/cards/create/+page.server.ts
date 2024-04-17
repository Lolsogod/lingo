import { createCardSchema } from '$lib/config/zod-schemas';
import { createCard } from '$lib/server/database/models/card';
import { fail } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
	const form = await superValidate(event, zod(createCardSchema));
	return { form };
}) satisfies PageServerLoad;

export const actions = {
	default: async (event) => {
		const userId = event.locals.user?.id;
		const form = await superValidate(event, zod(createCardSchema));
		if (!form.valid || !userId) {
			return fail(400, {
				form
			});
		}
		//add card to db
		try {
			const newCard = await createCard(form.data, userId);
			if (newCard) {
				setFlash({ type: 'success', message: 'Карта создана' }, event);
			}
		} catch (e) {
			console.error(e);
			setFlash({ type: 'error', message: 'Не удалось создать карту' }, event);
			return setError(form, 'blocks._errors', 'ошибка наверное');
		}
		console.log(form);
		return { form };
	}
};
