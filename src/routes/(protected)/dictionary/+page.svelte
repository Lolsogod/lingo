<script lang="ts">
	import { onMount } from 'svelte';
	import { initIndex, searchIndex } from './search';
	import type { Word } from './types';
	import { Input } from '$lib/components/ui/input';
	import { Loader2 } from 'lucide-svelte';
	import SearchResult from './SearchResult.svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let search: 'loading' | 'ready' = 'loading';
	let query = $page.url.searchParams.get('q') || '';
	let results: Word[] = [];

	onMount(async () => {
		await initIndex();
		search = 'ready';
	});

	$: if (search === 'ready') {
		results = searchIndex(query);
	}

	$: if (browser && query !== $page.url.searchParams.get('q')) {
		const url = new URL($page.url);
		url.searchParams.set('q', query);
		goto(url, {
			keepFocus: true,
			noScroll: true
		});
	}
</script>

<div class="mx-auto flex max-w-3xl flex-col items-center justify-center">
	<h1 class="mb-4 w-full">Словарь</h1>
	{#if search === 'ready'}
		<div class="w-full">
			<Input bind:value={query} placeholder="Поиск..." autocomplete="off" />
		</div>

		{#if results}
			<div class="mt-2 flex w-full flex-col gap-2">
				{#each results as word (word.id)}
					<SearchResult rawWord={word} />
				{/each}
			</div>
		{/if}
	{:else}
		<Loader2 size="48" class="animate-spin" />
	{/if}
</div>
