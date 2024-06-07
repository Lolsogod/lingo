<script lang="ts">
	//просто отвратительнешее повторение кода
	import CardItem from '$lib/components/items/CardItem.svelte';
	import type { PageData } from './$types';
	import ItemGrid from '$lib/components/items/ItemGrid.svelte';
	import AddCard from './AddCard.svelte';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { Input } from '$lib/components/ui/input';

	export let data: PageData;

	let query = $page.url.searchParams.get('add') || '';
	let tagQuery = $page.url.searchParams.get('add-tag') || '';
	
	$: if (browser && query !== $page.url.searchParams.get('add')) {
		const url = new URL($page.url);
		url.searchParams.set('add', query);
		goto(url, {
			keepFocus: true,
			noScroll: true
		});
	}
	$: if (browser && tagQuery !== $page.url.searchParams.get('add-tag')) {
		const url = new URL($page.url);
		url.searchParams.set('add-tag', tagQuery);
		goto(url, {
			keepFocus: true,
			noScroll: true
		});
	}
</script>

<div class="flex gap-2">
	<Input placeholder="поиск" class="max-w-xs" bind:value={query} />
	<Input placeholder="теги (через запятую)" class="max-w-xs" bind:value={tagQuery} />
</div>
<h2 class="border-b">Мои карты</h2>
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
<h2 class="border-b">Общие карты</h2>
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
