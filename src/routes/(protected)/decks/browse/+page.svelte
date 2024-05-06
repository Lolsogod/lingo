<script lang="ts">
	import type { PageData } from './$types';
	import DeckItem from '$lib/components/items/DeckItem.svelte';
	import ItemGrid from '$lib/components/items/ItemGrid.svelte';
	export let data: PageData;
</script>

<section class="container grid items-center gap-6">
	<h1>Все колоды</h1>
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
