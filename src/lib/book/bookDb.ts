import { openDB, deleteDB } from 'idb';

export const openBookDB = openDB('bookDB', 1, {
	upgrade(db) {
		db.createObjectStore('books', { keyPath: 'id', autoIncrement: true });
		db.createObjectStore('metas', { keyPath: 'id' });
	}
});
export type BookDb = typeof openBookDB;

export const addBook = async (meta: Metadata, book: Book) => {
	try {
		const db = await openBookDB;
		const tx = db.transaction(['books', 'metas'], 'readwrite');
		const booksStore = tx.objectStore('books');
		const metasStore = tx.objectStore('metas');

		const foundBook = (await metasStore.getAll()).find((b) => b.title === meta.title);
		if (foundBook) return foundBook.id; 

		const bookID = await booksStore.add(book);

		meta.id = Number(bookID);
		await metasStore.add(meta);

		await tx.done;

		return bookID;
	} catch (error) {
		console.error('Failed to add book:', error);
		return -1;
	}
};

export const getAllMetas = async (): Promise<Metadata[]> => {
	try {
		const store = (await openBookDB).transaction('metas').objectStore('metas');
		return await store.getAll();
	} catch (error) {
		console.error('Failed to get all books:', error);
		if (
			(error as Error).message.includes('version') ||
			(error as Error).message.includes('store name')
		) {
			console.log('Deleting old database');
			await deleteDB('bookDB');
			location.reload();
		}
		return [];
	}
};
