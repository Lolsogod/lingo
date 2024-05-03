import type { LayoutServerLoad } from './$types';
import { createCardSchema } from '$lib/config/zod-schemas';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { getDecksByAuthor, getStudyDecks } from '$lib/server/database/models/deck';

export const load = (async (event) => {
	const user = event.locals.user;

	const form = await superValidate(event, zod(createCardSchema));
	const decks = await getDecksByAuthor(user?.id);
	console.log('i am sending data...')
	return { form, decks };
}) satisfies LayoutServerLoad;
