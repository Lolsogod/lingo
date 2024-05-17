<script lang="ts">
	import { onMount } from 'svelte';
	import BookItem from './BookItem.svelte';
	import { Button } from '$lib/components/ui/button';
	import type { BookDb } from '$lib/book/bookDb';

	let bookDb: BookDb;
	let bookList: Metadata[] = [];

	const addBook = async () => {
		let input = document.createElement('input');
		const readFile = (await import('$lib/book/read')).readFile;

		input.type = 'file';
		input.multiple = false;
		input.onchange = async (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (!file) return;
			readFile(file);
			setTimeout(init, 1000);
		};
		input.click();
	};
	const deleteBook = async (id: number) => {
		bookList = bookList.filter((book) => book.id !== id);
		try {
			const db = await bookDb;
			const tx = db.transaction(['metas', 'books'], 'readwrite');
			tx.objectStore('metas').delete(id);
			tx.objectStore('books').delete(id);
			await tx.done;
		} catch (error) {
			console.error('Failed to delete book:', error);
		}
	};
	const init = async () => {
		const libdb = await import('$lib/book/bookDb');
		bookDb = libdb.openBookDB;
		bookList = await libdb.getAllMetas();
	};

	onMount(async () => {
		await init();
	});
</script>

<section class="container grid items-center gap-6">
	<Button class="w-52" on:click={() => addBook()}>Добавить книгу</Button>
	{#if bookList}
		<div class="book-grid">
			{#each bookList as book (book.id)}
				<BookItem {book} {deleteBook} />
			{/each}
		</div>
	{/if}
</section>

<style scoped>
	.book-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
		grid-gap: 1rem;
	}
</style>
