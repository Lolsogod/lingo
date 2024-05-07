import type { Word } from './types';
import FlexSearch from 'flexsearch';

let index: FlexSearch.Index;
let words: Word[];

export const createIndex = (data: Word[]) => {
	index = new FlexSearch.Index({ tokenize: 'forward' });

	data.forEach((word, i) => {
		const item = `${word.kanji[0]?.text ?? ''} ${word.kana[0]?.text ?? ''} ${word.sense[0]?.gloss[0]?.text ?? ''}`; //improve this
		index.add(i, item);
	});

	words = data;
};

export const searchIndex = (searchTerm: string) => {
	const match = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const results = index.search(match, { limit: 20 });

	return results.map((index) => words[index as number]);
};

export const initIndex = async () => {
	if (!index || !words) {
		const words = await fetch('/dictionary.json').then((r) => r.json());
		createIndex(words);
	}
};
