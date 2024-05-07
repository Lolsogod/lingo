interface Kanji {
	common: boolean;
	text: string;
	tags: string[];
}

interface Kana {
	common: boolean;
	text: string;
	tags: string[];
	appliesToKanji: string[];
}

interface Gloss {
	lang: string;
	gender: null | string;
	type: null | string;
	text: string;
}

interface Sense {
	partOfSpeech: string[];
	appliesToKanji: string[];
	appliesToKana: string[];
	related: any[];
	antonym: any[];
	field: any[];
	dialect: any[];
	misc: any[];
	info: any[];
	languageSource: any[];
	gloss: Gloss[];
}

export interface Word {
	id: string;
	kanji: Kanji[];
	kana: Kana[];
	sense: Sense[];
}


import FlexSearch from 'flexsearch';

let index: FlexSearch.Index;
let words: Word[];
//move to server?
export const createIndex = (data: Word[]) => {
	index = new FlexSearch.Index({ tokenize: 'forward' });

	data.forEach((word, i) => {
        const item = `${word.kanji[0]?.text ?? ''} ${word.kana[0]?.text ?? ''} ${word.sense[0]?.gloss[0]?.text ?? ''}`; //improve this
        index.add(i, item);
	});

    words = data;
}

export const searchIndex = (
	searchTerm: string,
) => {
	const match = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const results = index.search(match);

	return results.map((index) => words[index as number]);
};