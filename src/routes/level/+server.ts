import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	let level;
	try {
		const word = url.searchParams.get('word');
		const res = await fetch(`https://jisho.org/api/v1/search/words?keyword=${word}`);
		const parsed = await res.json();
		const rawLevel = parsed.data[0].jlpt[0];
		level = 6 - Number(rawLevel[rawLevel.length - 1]);
	} catch (e) {
		level = '';
	}
	console.log('level is', level);
	return new Response(JSON.stringify({ level }));
};
