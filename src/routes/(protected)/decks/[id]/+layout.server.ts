import { getDeckById } from '$lib/server/database/models/deck';
import { superValidate } from 'sveltekit-superforms';
import type { LayoutServerLoad } from './$types';
import { deleteDeckSchema, startStudySchema } from '$lib/config/zod-schemas';
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
	const deleteDeckForm = await superValidate(event, zod(deleteDeckSchema));
	const cards = await getCardsByDeckId(deckId);
	const alredyStudying = deck.studyDecks.some((sd) => sd.userId === user?.id); //кривые структуры как то в порядок преводить на этапе модели например дека

	const canEdit = deck.authorId === user?.id;

	return { startStudyForm, deck, cards, alredyStudying, canEdit, deleteDeckForm };
}) satisfies LayoutServerLoad;
