<script lang="ts">
	//просто отвратительнешее повторение кода
	import CardItem from '$lib/components/items/CardItem.svelte';
	import type { PageData } from './$types';
	import ItemGrid from '$lib/components/items/ItemGrid.svelte';
	import AddCard from './AddCard.svelte';
	export let data: PageData;
</script>

<h2
	class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
	Мои карты
</h2>
{#if data.userCreatedCards}
	<ItemGrid>
		{#each data.userCreatedCards as card}
			<CardItem cardInfo={card}>
				<AddCard cardInfo={card} {data} />
			</CardItem>
		{/each}
	</ItemGrid>
{:else}
	<span class="text-xl text-muted-foreground">нет карт</span>
{/if}
<h2
	class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
	Общие карты
</h2>
{#if data.publicCards}
	<ItemGrid>
		{#each data.publicCards as card}
			<CardItem cardInfo={card}>
				<AddCard cardInfo={card} {data} />
			</CardItem>
		{/each}
	</ItemGrid>
{:else}
	<span class="text-xl text-muted-foreground">нет карт</span>
{/if}
