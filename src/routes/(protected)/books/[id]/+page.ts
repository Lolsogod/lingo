export const ssr = false;
import type { PageLoad } from './$types';
import { getLoaded, setLoaded } from '$lib/book/stores';
import { error } from '@sveltejs/kit';

export const load = (async ({ params }) => {
	const loaded = getLoaded();

	if (loaded && (!params.id || loaded.meta.id === Number(params.id))) {
		return loaded;
	}

	if (!params.id) error(400, 'No book loaded and no book ID provided');

	const bookId = Number(params.id);

	if (isNaN(bookId) || !Number.isInteger(bookId) || bookId <= 0) {
		error(400, 'Invalid or non-numeric book ID provided');
	}

	const db = await (await import('$lib/book/bookDb')).openBookDB;

	const tx = db.transaction(['metas', 'books'], 'readonly');
	const meta = await tx.objectStore('metas').get(bookId);
	const book = await tx.objectStore('books').get(bookId);
	await tx.done;

	if (!book) error(404, `Book with ID ${bookId} not found in your saved books`);

	const stored = { meta, book };
	setLoaded(stored);

	return stored;
}) satisfies PageLoad;
