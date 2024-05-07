import { getCardById } from '$lib/server/database/models/card';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
	const cardId = event.params.id;
	const card = await getCardById(cardId);
	if (!card) {
		error(404, 'Card not found');
	}
	return { card };
}) satisfies PageServerLoad;
