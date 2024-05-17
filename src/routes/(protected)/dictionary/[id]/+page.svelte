<script lang="ts">
	import type { PageData } from './$types';
	import SearchResult from '../SearchResult.svelte';
	import { Button } from '$lib/components/ui/button';
	import ItemGrid from '$lib/components/items/ItemGrid.svelte';
	import CardItem from '$lib/components/items/CardItem.svelte';

	export let data: PageData;
</script>

<section class="mx-auto flex max-w-3xl flex-col items-start justify-center gap-4">
	<Button href="/dictionary" variant="secondary">Назад</Button>
	<div class="w-full">
		<SearchResult rawWord={data.word} detailed />
	</div>
	{#if data.relatedCards.length > 0}
		<h2 class="text-2xl font-bold">Связанные карты</h2>
		<ItemGrid class="w-full">
			{#each data.relatedCards as card}
				<CardItem cardInfo={card} />
			{/each}
		</ItemGrid>
	{:else}
		<p class="text-center text-lg">Нет связанных карт</p>
	{/if}
</section>
