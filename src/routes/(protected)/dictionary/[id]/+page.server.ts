import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import type { Word } from '../types';

export const load = (async (event) => {
    const wordId = event.params.id;
	const fetch = event.fetch;

	const words: Word[] = await fetch('/dictionary.json').then((r) => r.json());
	const word = words.find((word) => word.id === wordId);
	if (!word) {
		console.log('errorign');
		error(404, 'Word not found');
	}
	return { word };
}) satisfies PageServerLoad;