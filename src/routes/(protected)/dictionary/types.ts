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
