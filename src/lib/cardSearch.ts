import FlexSearch from 'flexsearch';
import type { CardExp } from '$lib/server/database/schema';

export const createCardIndex = (data: CardExp[]) => {
	const cardsIndex: FlexSearch.Index = new FlexSearch.Index({ tokenize: 'full' });
	data.forEach((card, i) => {
		cardsIndex.add(i, card.topic.name);
	});

	return cardsIndex;
};

export const searchCardsIndex = (
	searchTerm: string,
	cardsIndex: FlexSearch.Index,
	cards: CardExp[]
) => {
	const match = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const results = cardsIndex.search(match);

	return results.map((index) => cards[index as number]).sort((a, b) => {
		if (a.topic.name === searchTerm && b.topic.name !== searchTerm) {
		  return -1; 
		} else if (a.topic.name !== searchTerm && b.topic.name === searchTerm) {
		  return 1; 
		} else {
		  return 0;
		}});
};
