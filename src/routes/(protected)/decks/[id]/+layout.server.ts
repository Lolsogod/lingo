import {
	getDeckById,
	getDeckTags,
	getLikesDislikes,
	getUsersLikeStatusForDeck
} from '$lib/server/database/models/deck';
import { superValidate } from 'sveltekit-superforms';
import { createCardIndex, searchCardsIndex } from '$lib/cardSearch';
import type { LayoutServerLoad } from './$types';
import {
	deleteDeckSchema,
	dislikeSchema,
	likeSchema,
	startStudySchema
} from '$lib/config/zod-schemas';
import {
	findBlockByTopic,
	findBlocks,
	getCardsByDeckId,
	getBlockLikesDislikes,
	getUsersLikeStatusForBlock
} from '$lib/server/database/models/card';
import { error } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';

export const load = (async (event) => {
	const user = event.locals.user;
	const deckId = event.params.id;
	const query = event.url.searchParams.get('q') || null;
	const tagQuery =
	event.url.searchParams
		.get('tag')
		?.split(',')
		.map((tag) => tag.trim())
		.filter((tag) => tag !== '') || null;
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

	if (tagQuery) {
		console.log(tagQuery);
		const filterByTags = (cards: { tags: string[] }[] | null, tags: string[]) => {
			return cards?.filter((card) => tags.every((tag) => card.tags.includes(tag))) || null;
		};

		cards = filterByTags(cards, tagQuery);
	}
	const alredyStudying = deck.studyDecks.some((sd) => sd.userId === user?.id); //кривые структуры как то в порядок преводить на этапе модели например дека

	const canEdit = deck.authorId === user?.id;

	const blocksBytitle = await findBlocks(topic);
	const blockByTopicId = await findBlockByTopic(topic);

	const blocks = [...blocksBytitle, ...blockByTopicId].filter(
		(block, index, self) => index === self.findIndex((b) => b.id === block.id)
	);

	const blocksWithLikes = await Promise.all(
		blocks.map(async (block) => {
			const likeStatus = await getUsersLikeStatusForBlock(block.id, user.id);
			const { likes, dislikes, rating } = await getBlockLikesDislikes(block.id);
			return { ...block, liked: likeStatus?.liked || false, likes, dislikes, rating };
		})
	);

	blocksWithLikes.sort((a, b) => {
		if (a.liked && !b.liked) return -1;
		if (!a.liked && b.liked) return 1;
		return b.rating - a.rating;
	});

	const likeForm = await superValidate(event, zod(likeSchema));
	const dislikeForm = await superValidate(event, zod(dislikeSchema));
	const { likes, dislikes, rating } = await getLikesDislikes(deckId);

	const likeStatus = await getUsersLikeStatusForDeck(deckId, user.id);

	const deckTags = await getDeckTags(deckId);

	return {
		startStudyForm,
		deck,
		cards,
		alredyStudying,
		canEdit,
		deleteDeckForm,
		blocks: blocksWithLikes,
		likeForm,
		dislikeForm,
		likes,
		dislikes,
		rating,
		likeStatus,
		deckTags
	};
}) satisfies LayoutServerLoad;
