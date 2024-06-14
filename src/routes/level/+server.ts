import type { RequestHandler } from './$types';

function identifyJapaneseCharacterType(input: string): string {
    const hiraganaRegex = /^[\u3040-\u309F]+$/;
    const katakanaRegex = /^[\u30A0-\u30FF]+$/;
    const kanjiRegex = /^[\u4E00-\u9FAF]+$/;

    if (hiraganaRegex.test(input)) {
        return 'Хирагана';
    } else if (katakanaRegex.test(input)) {
        return 'Катакана';
    } else if (kanjiRegex.test(input)) {
        return 'Кандзи';
    } else {
        return 'Неизвестный тип';
    }
}


export const GET: RequestHandler = async ({ url }) => {
	let level;
	const tags = [];
	try {
		const word = url.searchParams.get('word');
		const res = await fetch(`https://jisho.org/api/v1/search/words?keyword=${word}`);
		const parsed = await res.json();
		const wordInfo = parsed.data[0];
		console.log(wordInfo)
		const rawLevel = wordInfo.jlpt[0];
		level = 6 - Number(rawLevel[rawLevel.length - 1]);

		tags.push(identifyJapaneseCharacterType(word || ''));
		//auto tags
		if (wordInfo.is_common) {
			tags.push('Частоупотребляемое');
		}else {
			tags.push('Редкое');
		}
		if (wordInfo.senses[0].parts_of_speech.includes('Noun')) {
			tags.push('Существительное');
		}
		if (wordInfo.senses[0].parts_of_speech.includes('Verb')) {
			tags.push('Глагол');
		}
		if (wordInfo.senses[0].parts_of_speech.includes('Adjective')) {
			tags.push('Прилагательное');
		}
		if (wordInfo.senses[0].parts_of_speech.includes('Adverb')) {
			tags.push('Наречие');
		}
		if (wordInfo.senses[0].parts_of_speech.includes('Pronoun')) {
			tags.push('Местоимение');
		}
		if (wordInfo.senses[0].parts_of_speech.includes('Conjunction')) {
			tags.push('Союз');
		}
		if (wordInfo.senses[0].parts_of_speech.includes('Interjection')) {
			tags.push('Междометие');
		}
		if (wordInfo.senses[0].parts_of_speech.includes('Particle')) {
			tags.push('Частица');
		}
		if (wordInfo.senses[0].parts_of_speech.includes('Place')) {
			tags.push('Место');
		}
		
	} catch (e) {
		console.log(e)
		level = ''
	}

	console.log('level is', level);
	return new Response(JSON.stringify({ level, tags: tags.join(', ') }));
};
