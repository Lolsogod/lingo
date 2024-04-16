<script lang="ts">
import type { PageData } from './$types';
import Deck from './Deck.svelte';
export let data: PageData;
</script>

<section class="container grid items-center gap-6">
	<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Все колоды</h1>
	<h2
		class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
	>
		Мои колоды
	</h2>

	{#if data.userCreatedDecks}
		<div class="grid grid-cols-3 gap-5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8">
			{#each data.userCreatedDecks as deck}
				<Deck deckInfo={deck} />
			{/each}
		</div>
	{:else}
		<span class="text-xl text-muted-foreground">нет колод</span>
	{/if}
	<h2
		class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
	>
		Общие колоды
	</h2>
	{#if data.publicDecks}
		<div class="grid grid-cols-3 gap-5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8">
			{#each data.publicDecks as deck}
				<Deck deckInfo={deck} />
			{/each}
		</div>
	{:else}
		<span class="text-xl text-muted-foreground">нет колод</span>
	{/if}
</section>
