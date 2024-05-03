import type { LayoutServerLoad } from './$types';
import { createCardSchema } from '$lib/config/zod-schemas';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = (async (event) => {
	const form = await superValidate(event, zod(createCardSchema));

	return { form };
}) satisfies LayoutServerLoad;
