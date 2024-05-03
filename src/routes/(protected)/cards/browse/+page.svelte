<script lang="ts">
	import type { PageData } from './$types';
	import { Input } from '$lib/components/ui/input';
	import CardItem from '$lib/components/items/CardItem.svelte';
	export let data: PageData;
	import ItemGrid from '$lib/components/items/ItemGrid.svelte';
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	let query = $page.url.searchParams.get('q') || '';

	$: if (browser) {
		const url = new URL($page.url);
		url.searchParams.set('q', query);
		goto(url, {
			keepFocus: true
		});
	}
</script>

<section class="container grid items-center gap-6">
	<div class="flex justify-between">
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Все карты</h1>
		<Button href="create">Создать карту</Button>
	</div>
	<Input placeholder="поиск" class="max-w-xs" bind:value={query} />
	<h2
		class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
		Мои карты
	</h2>

	{#if data.userCreatedCards}
		<ItemGrid>
			{#each data.userCreatedCards as card}
				<CardItem cardInfo={card} />
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
				<CardItem cardInfo={card} />
			{/each}
		</ItemGrid>
	{:else}
		<span class="text-xl text-muted-foreground">нет карт</span>
	{/if}
</section>
