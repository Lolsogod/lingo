import { addBook } from './bookDb';
import { setLoaded, shouldSaveStore } from './stores';
import { parseEpub } from './parse';
import { get } from 'svelte/store';

export const readFile = async (file: File) => {
	try {
		if (!file.type.includes('epub') || !file.type.includes('zip')) {
			throw new Error('File is not of type .epub or .zip');
		}
		const { meta, book } = await parseEpub(file);
		let id = '';

		if (get(shouldSaveStore) && file.size < 30000000) {
			id = await addBook(meta, book);
		}

		setLoaded({ meta, book });
	} catch (e) {
		console.log(e);
	}
};
//TODO: only works for localhost...
export const relativeToAbs = (href: string, relativeTo: string) => {
	const url = new URL(href, `http://localhost/${relativeTo}`);
	return decodeURI(url.pathname.slice(1));
};

export const removeHash = (path: string) => {
	const hashIndex = path.indexOf('#');
	return hashIndex === -1 ? path : path.slice(0, hashIndex);
};
