<script lang="ts">
	import type { PageData } from './$types';
	import DeckItem from '$lib/components/items/DeckItem.svelte';
	import ItemGrid from '$lib/components/items/ItemGrid.svelte';
	import { Input } from '$lib/components/ui/input';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	export let data: PageData;

	let query = $page.url.searchParams.get('q') || ''; //TODO: доделвть
	let tagQuery = $page.url.searchParams.get('tag') || '';

	$: if (browser && query !== $page.url.searchParams.get('q')) {
		const url = new URL($page.url);
		url.searchParams.set('q', query);
		goto(url, {
			keepFocus: true,
			noScroll: true
		});
	}
	$: if (browser && tagQuery !== $page.url.searchParams.get('tag')) {
		const url = new URL($page.url);
		url.searchParams.set('tag', tagQuery);
		goto(url, {
			keepFocus: true,
			noScroll: true
		});
	}
</script>

<section class="container grid items-center gap-6">
	<div class="flex justify-between">
		<h1>Все колоды</h1>
		<Button href="create">Создать колоду</Button>
	</div>
	<div class="flex gap-2">
		<Input placeholder="поиск" class="max-w-xs" bind:value={query} />
		<Input placeholder="теги (через запятую)" class="max-w-xs" bind:value={tagQuery} />
	</div>
	<h2 class="border-b">Мои колоды</h2>

	{#if data.userCreatedDecks}
		<ItemGrid>
			{#each data.userCreatedDecks as deck}
				<DeckItem deckInfo={deck} />
			{/each}
		</ItemGrid>
	{:else}
		<span class="text-xl text-muted-foreground">нет колод</span>
	{/if}
	<h2 class="border-b">Общие колоды</h2>
	{#if data.publicDecks}
		<ItemGrid>
			{#each data.publicDecks as deck}
				<DeckItem deckInfo={deck} />
			{/each}
		</ItemGrid>
	{:else}
		<span class="text-xl text-muted-foreground">нет колод</span>
	{/if}
</section>
