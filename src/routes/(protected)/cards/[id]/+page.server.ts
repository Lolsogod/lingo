import { getCardById } from '$lib/server/database/models/card';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
	const cardId = event.params.id;
	const card = await getCardById(cardId);
	if (!card) {
		error(404, 'Card not found');
	}
	const avgDiff = (
		card.studyCard.reduce((acc, card) => acc + card.difficulty, 0) / card.studyCard.length
	).toFixed(1);
	return { card, avgDiff };
}) satisfies PageServerLoad;
