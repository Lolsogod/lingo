<script lang="ts">
	import CreateCardForm from '$lib/components/forms/card/CreateCardForm.svelte';
	import CardItem from '$lib/components/items/CardItem.svelte';
	import ItemGrid from '$lib/components/items/ItemGrid.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>
<CreateCardForm data={data.form} decks={data.decks} blocks={data.blocks}/>
{#if data.relatedCards.length > 0}
	<h2>Другие карты на эту тему</h2>
	<ItemGrid>
		{#each data.relatedCards as card}
			<CardItem cardInfo={card}>
				<!--добавление добавить-->
			</CardItem>
		{/each}
	</ItemGrid>
{/if}
