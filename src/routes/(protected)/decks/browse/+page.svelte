<script lang="ts">
	import type { PageData } from './$types';
	import DeckItem from '$lib/components/items/DeckItem.svelte';
	import ItemGrid from '$lib/components/items/ItemGrid.svelte';
	export let data: PageData;
</script>

<section class="container grid items-center gap-6">
	<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Все колоды</h1>
	<h2
		class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
		Мои колоды
	</h2>

	{#if data.userCreatedDecks}
		<ItemGrid>
			{#each data.userCreatedDecks as deck}
				<DeckItem deckInfo={deck} />
			{/each}
		</ItemGrid>
	{:else}
		<span class="text-xl text-muted-foreground">нет колод</span>
	{/if}
	<h2
		class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
		Общие колоды
	</h2>
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
