<script lang="ts">
	import StudyDeckItem from './StudyDeckItem.svelte';
	import ItemGrid from '$lib/components/items/ItemGrid.svelte';
	import type { PageData } from './$types';
	import AddDeck from './AddDeck.svelte';
	import Welcome from './Welcome.svelte';
	import BookItem from '../books/BookItem.svelte';
	import type { BookDb } from '$lib/book/bookDb';
	import { onMount } from 'svelte';
	import VideoItem from '../video/VideoItem.svelte';
	export let data: PageData;
	let bookDb: BookDb;
	let startedBooks: Metadata[] = [];
	let watchHistory: { url: string; title: string; thumbnail: string }[] = [];
	const init = async () => {
		const libdb = await import('$lib/book/bookDb');
		bookDb = libdb.openBookDB;
		startedBooks = await libdb.getAllMetas();
		startedBooks = startedBooks.filter((book) => book.progress > 0 && book.progress < book.length);
	};

	onMount(async () => {
		watchHistory = JSON.parse(localStorage.getItem('videoInfo') || '[]').slice(0, 5);
		console.log(watchHistory);
		await init();
	});
</script>

<section class="container grid items-center gap-6">
	<Welcome />
	<h1>Колоды для повторения</h1>
	<ItemGrid>
		{#each data.decksWithQueues as studyDeck}
			<StudyDeckItem deckInfo={studyDeck} />
		{/each}
		<AddDeck />
	</ItemGrid>
	<div class="flex items-end gap-5">
		<h1>Продолжить читать</h1>
		<span class="italic text-muted-foreground underline"><a href="/books">Все книги →</a></span>
	</div>
	<div class="book-grid">
		{#each startedBooks as book (book.id)}
			<BookItem {book} />
		{/each}
	</div>

	<div class="flex items-end gap-5">
		<h1>Продолжить смотреть</h1>
		<span class="italic text-muted-foreground underline"><a href="/video">Все видео →</a></span>
	</div>
	<div class="video-grid">
		{#each watchHistory as video (video.url)}
			<VideoItem {video} />
		{/each}
	</div>
	<br />
</section>

<style scoped>
	.book-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
		grid-gap: 1rem;
	}
	.video-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
		grid-gap: 1rem;
	}
</style>
