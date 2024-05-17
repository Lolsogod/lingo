import { getDeckById, getLikesDislikes, getUsersLikeStatusForDeck } from '$lib/server/database/models/deck';
import { superValidate } from 'sveltekit-superforms';
import { createCardIndex, searchCardsIndex } from '$lib/cardSearch';
import type { LayoutServerLoad } from './$types';
import { deleteDeckSchema, dislikeSchema, likeSchema, startStudySchema } from '$lib/config/zod-schemas';
import { findBlocks, getCardsByDeckId } from '$lib/server/database/models/card';
import { error } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';

export const load = (async (event) => {
	const user = event.locals.user;
	const deckId = event.params.id;
	const query = event.url.searchParams.get('q') || null;
	const topic = event.url.searchParams.get('topic') || '';

	const deck = await getDeckById(deckId, user?.id);
	if (!deck || !user) {
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
	
	const likeForm = await superValidate(event, zod(likeSchema));
	const dislikeForm = await superValidate(event, zod(dislikeSchema));
	const { likes, dislikes, rating } = await getLikesDislikes(deckId);

	const likeStatus = await getUsersLikeStatusForDeck(deckId, user.id);

	return { startStudyForm, deck, cards, alredyStudying, canEdit, deleteDeckForm, blocks, likeForm, dislikeForm, likes, dislikes, rating, likeStatus };
}) satisfies LayoutServerLoad;
