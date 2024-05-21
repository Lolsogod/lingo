import type { PageServerLoad, PageServerLoadEvent } from './$types';
import { error } from '@sveltejs/kit';
import { createCardIndex, searchCardsIndex } from '$lib/cardSearch';
import {process} from '../processWord';
import {
	createComment,
	findBlocks,
	getCardsByAuthor,
	getComentsForTopic,
	getPublicCards,
	addBlockLike,
	addBlockDislike,
	removeBlockLike,
	getUsersLikeStatusForBlock,
	getBlockLikesDislikes,
	findTopicByName
} from '$lib/server/database/models/card';
import type { Block, CardExp, Topic, User } from '$lib/server/database/schema';
import { fail, superValidate, type SuperValidated } from 'sveltekit-superforms';
import type { Word } from '../types';
import { zod } from 'sveltekit-superforms/adapters';
import { blockLikeSchema, commentSchema, likeSchema } from '$lib/config/zod-schemas';
import { setFlash } from 'sveltekit-flash-message/server';

const getCommentData = async (event: PageServerLoadEvent, comments: (Block & { author: User })[], user: any) => {
	const likesData: {
		comment: Block & { author: User };
		likeForm: SuperValidated<any>;
		dislikeForm: SuperValidated<any>;
		likeStatus: 'liked' | 'disliked' | 'unrated';
		likes: any[];
		dislikes: any[];
		rating: number;
	}[] = [];

	for (const comment of comments) {
		const likeForm = await superValidate(event, zod(blockLikeSchema), {
			id: comment.id + 'l'
		});
		likeForm.data.blockId = comment.id;
		const dislikeForm = await superValidate(event, zod(blockLikeSchema), {
			id: comment.id + 'd'
		});
		dislikeForm.data.blockId = comment.id;
		const serverlikeStatus = await getUsersLikeStatusForBlock(comment.id, user.id);
		const likeStatus = serverlikeStatus ? (serverlikeStatus.liked ? 'liked' : 'disliked') : 'unrated';
		const { likes, dislikes, rating } = await getBlockLikesDislikes(comment.id);
		console.log('puching.... for', comment.content);
		likesData.push({ comment, likeForm, dislikeForm, likeStatus, likes, dislikes, rating });
	}

	return likesData;
};
 
export const load = (async (event) => {
	const user = event.locals.user;
	const wordId = event.params.id;
	const fetch = event.fetch;

	const words: Word[] = await fetch('/dictionary.json').then((r) => r.json());
	const word = words.find((word) => word.id === wordId);
	if (!word) {
		console.log('errorign');
		error(404, 'Word not found');
	}

	const publicCards: CardExp[] = (await getPublicCards(user?.id)) || [];
	const userCreatedCards: CardExp[] = (await getCardsByAuthor(user?.id)) || [];

	const allCards = [...publicCards, ...userCreatedCards];

	const uniqueCardsMap = new Map<string, CardExp>();
	const searchTerms = [...(word.kanji || []), ...(word.kana || [])].flatMap((k) => k.text);
	const searchSymbols = searchTerms.flatMap((k) => k.split(''));
	const index = createCardIndex(allCards);

	for (const term of searchSymbols) {
		if (allCards.length > 0) {
			const foundCards = searchCardsIndex(term, index, allCards);
			foundCards.forEach((card) => {
				if (card) {
					uniqueCardsMap.set(card.id, card);
				}
			});
		}
	}

	const exactMatchedCardsMap = new Map<string, CardExp>();
	const relatedCardsMap = new Map<string, CardExp>();

	for (const [id, card] of uniqueCardsMap) {
		const cardText = card.topic.name;
		const isExactMatch = searchTerms.some((term) => cardText === term);
		const isPartOfWord = searchTerms.some((term) => cardText.includes(term));
		const isWordPartOfCard = searchTerms.some((term) => term.includes(cardText));

		if (isExactMatch) {
			exactMatchedCardsMap.set(id, card);
		} else if (isPartOfWord || isWordPartOfCard) {
			relatedCardsMap.set(id, card);
		}
	}
	let matchedTopic: Topic | null = null;
	let comments: (Block & { author: User })[] | null = null;
	let commentsData: {
		comment: Block & { author?: User };
		likeForm: SuperValidated<any>;
		dislikeForm: SuperValidated<any>;
		likeStatus: 'liked' | 'disliked' | 'unrated';
		likes: any[];
		dislikes: any[];
		rating: number;
	}[] = []

	const exactMatchedCards = Array.from(exactMatchedCardsMap.values());
	const relatedCards = Array.from(relatedCardsMap.values());
	if (exactMatchedCards.length > 0) {
		matchedTopic = exactMatchedCards[0].topic;
	} else {
		matchedTopic = await findTopicByName(process(word).title);
	}

	const commentForm = await superValidate(event, zod(commentSchema));

	if (matchedTopic && user) {
		console.log('what ')
		commentForm.data.topicId = matchedTopic.id;
		comments = await getComentsForTopic(matchedTopic.id) as (Block & { author: User })[];
		commentsData = await getCommentData(event, comments, user);
		commentsData.sort((a, b) => b.rating - a.rating);
	} else {
		commentForm.data.potentialTopicName =  process(word).title;
	}

	return { word, exactMatchedCards, relatedCards, matchedTopic, commentForm, commentsData };
}) satisfies PageServerLoad;

export const actions = {
	comment: async (event) => {
		const user = event.locals.user
		const commentForm = await superValidate(event, zod(commentSchema));
		console.log(commentForm.data)
		if (!commentForm.valid) {
			return fail(400, { commentForm });
		}
		try {
			console.log(commentForm.data)
			const newCommnet = await createComment(commentForm.data.topicId, commentForm.data.comment, commentForm.data.potentialTopicName, user!.id, commentForm.data.type);
			if (newCommnet) {
				setFlash({ type: 'success', message: 'Коментарий успешно создан' }, event);
			}
			return { commentForm };
		} catch (error) {
			console.error(error);
			setFlash({ type: 'error', message: 'Произошла ошибка при создании коментария' }, event);
			return fail(500, { commentForm });
		}
	},
	rate: async (event) => {
		console.log('работаем.......................');
		const userId = event.locals.user?.id;
		
		const likeForm = await superValidate(event, zod(blockLikeSchema));
		if (!likeForm.valid || !userId) {
			return fail(400, {
				likeForm
			});
		}
		const blockId = likeForm.data.blockId;
		const { liked } = likeForm.data;
		if (liked) {
			await addBlockLike(userId, blockId);
		} else {
			await addBlockDislike(userId, blockId);
		}
	}, 
	unrate: async (event) => {
		const userId = event.locals.user?.id;
		const commentForm = await superValidate(event, zod(blockLikeSchema));
		const blockId = commentForm.data.blockId;
		console.log(blockId, userId)
		if (!userId || !blockId) {
			return fail(400);
		}
	
		await removeBlockLike(userId, blockId);
		return {commentForm}
	}
};