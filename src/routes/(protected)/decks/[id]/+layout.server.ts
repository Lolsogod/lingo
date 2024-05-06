import { getDeckById } from '$lib/server/database/models/deck';
import { superValidate } from 'sveltekit-superforms';
import { createCardIndex, searchCardsIndex } from '$lib/cardSearch';
import type { LayoutServerLoad } from './$types';
import { deleteDeckSchema, startStudySchema } from '$lib/config/zod-schemas';
import { findBlocks, getCardsByDeckId } from '$lib/server/database/models/card';
import { error } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';

export const load = (async (event) => {
	const user = event.locals.user;
	const deckId = event.params.id;
	const query = event.url.searchParams.get('q') || null;
	const topic = event.url.searchParams.get('topic') || '';

	const deck = await getDeckById(deckId, user?.id);
	if (!deck) {
		return error(404, 'Deck not found');
	}
	const startStudyForm = await superValidate(event, zod(startStudySchema));
	const deleteDeckForm = await superValidate(event, zod(deleteDeckSchema));
	let cards = await getCardsByDeckId(deckId);

	if (query) {
		if (cards) {
			const index = createCardIndex(cards);
			cards = searchCardsIndex(query, index, cards);
		}
	}

	const alredyStudying = deck.studyDecks.some((sd) => sd.userId === user?.id); //кривые структуры как то в порядок преводить на этапе модели например дека

	const canEdit = deck.authorId === user?.id;

	const blocks = await findBlocks(topic);

	return { startStudyForm, deck, cards, alredyStudying, canEdit, deleteDeckForm, blocks };
}) satisfies LayoutServerLoad;
