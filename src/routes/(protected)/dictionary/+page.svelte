<script lang="ts">
	import { onMount } from 'svelte';
	import { initIndex, searchIndex } from './search';
	import type { Word } from './types';
	import { Input } from '$lib/components/ui/input';
	import { Loader2 } from 'lucide-svelte';
	import SearchResult from './SearchResult.svelte';

	let search: 'loading' | 'ready' = 'loading';
	let query = '';
	let results: Word[] = [];

	onMount(async () => {
		await initIndex()
		search = 'ready';
	});

	$: if (search === 'ready') {
		results = searchIndex(query);
	}
</script>

<div class="mx-auto flex max-w-3xl flex-col items-center justify-center">
	{#if search === 'ready'}
		<div class="w-full">
			<Input bind:value={query} placeholder="Поиск..." autocomplete="off" />
		</div>

		{#if results}
		<div class="flex flex-col gap-2 w-full mt-2">
			{#each results as word (word.id)}
				<SearchResult rawWord={word} />
			{/each}
		</div>
		{/if}
	{:else}
		<Loader2 size="48" class="animate-spin" />
	{/if}
</div>
