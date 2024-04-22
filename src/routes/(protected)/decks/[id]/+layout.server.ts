import { getDeckById } from '$lib/server/database/models/deck';
import { superValidate } from 'sveltekit-superforms';
import type { LayoutServerLoad } from './$types';
import { startStudySchema } from '$lib/config/zod-schemas';
import { getCardsByDeckId } from '$lib/server/database/models/card';
import { error } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';

export const load = (async (event) => {
	const user = event.locals.user;
	const deckId = event.params.id;

	const deck = await getDeckById(deckId, user?.id);
	if (!deck) {
		return error(404, 'Deck not found');
	}
	const startStudyForm = await superValidate(event, zod(startStudySchema));
	const cards = await getCardsByDeckId(deckId);
	const alredyStudying = deck.userDecks.some((ud) => ud.userId === user?.id); //кривые структуры как то в порядок преводить на этапе модели например дека
	return { startStudyForm, deck, cards, alredyStudying };
}) satisfies LayoutServerLoad;