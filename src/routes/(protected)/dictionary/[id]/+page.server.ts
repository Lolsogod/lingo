import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { createCardIndex, searchCardsIndex } from '$lib/cardSearch';
import { getCardsByAuthor, getPublicCards } from '$lib/server/database/models/card';
import type { CardExp } from '$lib/server/database/schema';
import type { Word } from '../types';

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
	const searchTerms = [...(word.kanji || []), ...(word.kana || [])].flatMap(k => k.text);
	const searchSymbols = searchTerms.flatMap(k => k.split(''));
	const index = createCardIndex(allCards);

	for (const term of searchSymbols) {
		if (allCards.length > 0) {
			const foundCards = searchCardsIndex(term, index, allCards);
			foundCards.forEach(card => {
				if (card) {
					uniqueCardsMap.set(card.id, card);
				}
			});
		}
	}

	const filteredCardsMap = new Map<string, CardExp>();
	for (const [id, card] of uniqueCardsMap) {
		const cardText = card.topic.name; 
		const isPartOfWord = searchTerms.some(term => cardText.includes(term));
		const isWordPartOfCard = searchTerms.some(term => term.includes(cardText));
		console.log(cardText, isPartOfWord, isWordPartOfCard)
		if (isPartOfWord || isWordPartOfCard) {
			filteredCardsMap.set(id, card);
		}
	}

	const relatedCards = Array.from(filteredCardsMap.values());

	return { word, relatedCards };
}) satisfies PageServerLoad;