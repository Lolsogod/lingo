<script lang="ts">
	import CreateCardForm from '$lib/components/forms/card/CreateCardForm.svelte';
	import CardItem from '$lib/components/items/CardItem.svelte';
	import ItemGrid from '$lib/components/items/ItemGrid.svelte';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<CreateCardForm data={data.form} decks={data.decks} blocks={data.blocks} />
{#if data.relatedCards.length > 0}
	<h4>Другие карты на эту тему</h4>
	<ItemGrid>
		{#each data.relatedCards as card}
			<CardItem cardInfo={card}>
				<!--TODO:добавление добавить-->
			</CardItem>
		{/each}
	</ItemGrid>
{/if}
