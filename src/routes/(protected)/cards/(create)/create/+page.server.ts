import type { PageServerLoad } from './$types';
import { createCardSchema } from '$lib/config/zod-schemas';
import { addCardToDeck, createCard, findBlockByTopic, findBlocks } from '$lib/server/database/models/card';
import { error, fail, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { createCardIndex, searchCardsIndex } from '$lib/cardSearch';
import { getCardsByAuthor, getPublicCards } from '$lib/server/database/models/card';
import type { CardExp } from '$lib/server/database/schema';
import { getUsersLikeStatusForBlock, getBlockLikesDislikes } from '$lib/server/database/models/card';

export const load = (async (event) => {
	const topic = event.url.searchParams.get('topic') || '';
	const user = event.locals.user;
	if(!user){
		error(401, 'Unauthorized');
	}
	const publicCards: CardExp[] | null = await getPublicCards(user?.id);
	const userCreatedCards: CardExp[] | null = await getCardsByAuthor(user?.id);
	let relatedCards: CardExp[] = [];
	if (topic) {
		relatedCards = [...(publicCards || []), ...(userCreatedCards || [])];
		if (relatedCards) {
			const index = createCardIndex(relatedCards);
			relatedCards = searchCardsIndex(topic, index, relatedCards);
		}
	}

	const blocksBytitle = await findBlocks(topic);
	const blockByTopicId = await findBlockByTopic(topic);
	
	const blocks = [...blocksBytitle, ...blockByTopicId].filter((block, index, self) =>
		index === self.findIndex((b) => b.id === block.id)
	);

	const blocksWithLikes = await Promise.all(blocks.map(async (block) => {
		const likeStatus = await getUsersLikeStatusForBlock(block.id, user.id);
		const { likes, dislikes, rating } = await getBlockLikesDislikes(block.id);
		return { ...block, liked: likeStatus?.liked || false, likes, dislikes, rating };
	}));

	blocksWithLikes.sort((a, b) => {
		if (a.liked && !b.liked) return -1;
		if (!a.liked && b.liked) return 1;
		return b.rating - a.rating;
	});

	return { relatedCards, blocks: blocksWithLikes };
}) satisfies PageServerLoad;

export const actions = {
	default: async (event) => {
		const userId = event.locals.user?.id;
		const form = await superValidate(event, zod(createCardSchema));

		if (!form.valid || !userId) {
			setFlash({ type: 'error', message: 'Не удалось создать карту' }, event);
			return fail(400, {
				form
			});
		}
		//add card to db
		try {
			const newCard = await createCard(form.data, userId);
			if (newCard) {
				setFlash({ type: 'success', message: 'Карта создана' }, event);
				if (form.data.addToStudy && form.data.studyDeckId) {
					const result = await addCardToDeck(form.data.studyDeckId, newCard.id);
					if (result) {
						setFlash({ type: 'success', message: 'Добавленна в колоду' }, event);
					}
				}
			}
		} catch (e) {
			console.error(e);
			setFlash({ type: 'error', message: 'Не удалось создать карту' }, event);
			return setError(form, 'blocks._errors', 'ошибка наверное');
		}
		console.log(form);
		redirect(302, '/cards/browse'); //редирект на пустую форму без топика сделать бы
		//вобще не понимаю что тут проиходит когда пытаешься остаться на странице
		//поэтому редирект
	}
};
