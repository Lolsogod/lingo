import type { LayoutServerLoad } from './$types';
import { createCardSchema } from '$lib/config/zod-schemas';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { getDecksByAuthor } from '$lib/server/database/models/deck';
import { findBlocks } from '$lib/server/database/models/card';

export const load = (async (event) => {
	const user = event.locals.user;

	const form = await superValidate(event, zod(createCardSchema));
	const decks = await getDecksByAuthor(user?.id);
	return { form, decks };
}) satisfies LayoutServerLoad;
