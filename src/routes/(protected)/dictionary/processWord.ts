import type { Word } from './types';
interface ProcessedWord {
	title: string;
	subTitle: string;
	alt: { text: string }[];
	meanings: any[];
}
export const process = (rawWord: Word) => {
	const word: ProcessedWord = {
		title: '',
		subTitle: '',
		alt: [],
		meanings: []
	};
	if (rawWord.kanji.length > 0) {
		word.title = rawWord.kanji[0].text;
		word.alt = rawWord.kanji.slice(1);
		if (rawWord.kana.length > 0) {
			word.subTitle = rawWord.kana[0].text;
		}
	} else {
		word.title = rawWord.kana[0].text;
		word.alt = rawWord.kana.slice(1);
	}
	if (rawWord.sense.length > 0) {
		word.meanings = rawWord.sense.flatMap((sense) => sense.gloss.map((gloss) => gloss.text));
	}

	return word;
};
