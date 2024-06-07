<script lang="ts">
	import type { PageData } from './$types';
	import DeckItem from '$lib/components/items/DeckItem.svelte';
	import ItemGrid from '$lib/components/items/ItemGrid.svelte';
	import { Input } from '$lib/components/ui/input';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	export let data: PageData;
	let query = $page.url.searchParams.get('q') || ''; //TODO: доделвть
</script>

<section class="container grid items-center gap-6">
	<div class="flex justify-between">
		<h1>Все колоды</h1>
		<Button href="create">Создать колоду</Button>
	</div>
	<Input placeholder="поиск" class="max-w-xs" bind:value={query} />
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
