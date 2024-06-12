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
	import { Slider } from '$lib/components/ui/slider/index.js';
	import { Switch } from '$lib/components/ui/switch';
	let query = $page.url.searchParams.get('q') || '';
	let tagQuery = $page.url.searchParams.get('tag') || '';

	$: if (browser && query !== $page.url.searchParams.get('q')) {
		const url = new URL($page.url);
		url.searchParams.set('q', query);
		goto(url, {
			keepFocus: true,
			noScroll: true
		});
	}
	$: if (browser && tagQuery !== $page.url.searchParams.get('tag')) {
		const url = new URL($page.url);
		url.searchParams.set('tag', tagQuery);
		goto(url, {
			keepFocus: true,
			noScroll: true
		});
	}
	let levelFilter = false;
	let sliderVal = [0, data.recommendedDifficulty];
</script>

<section class="container grid items-center gap-6">
	<div class="flex justify-between">
		<h1>Все карты</h1>
		<Button href="create">Создать карту</Button>
	</div>
	<div class="flex gap-2">
		<Input placeholder="поиск" class="max-w-xs" bind:value={query} />
		<Input placeholder="теги (через запятую)" class="max-w-xs" bind:value={tagQuery} />
		<div class="flex flex-1 flex-col gap-2">
			<div class="flex items-center gap-2">
				<Switch bind:checked={levelFilter} />
				<span>Фильтр по уровню</span>
				{#if levelFilter}
				<Button variant="outline" on:click={() => {sliderVal[1] = data.recommendedDifficulty; sliderVal[0] = 0}}>
					Рекомендованный уровень: {data.recommendedDifficulty}
				</Button>
				{/if}
			</div>

			{#if levelFilter}
				<div class="flex items-center gap-5">
					<span>0</span>
					<Slider bind:value={sliderVal} max={5} step={1} class="max-w-[70%]" />
					<span>5</span>
				</div>
			{/if}
		</div>
	</div>
	<h2 class="border-b">Мои карты</h2>

	{#if data.userCreatedCards}
		<ItemGrid>
			{#each levelFilter ? data.userCreatedCards.filter((card) => card.level >= sliderVal[0] && card.level <= sliderVal[1]) : data.userCreatedCards as card}
				<CardItem cardInfo={card} />
			{/each}
		</ItemGrid>
	{:else}
		<span class="text-xl text-muted-foreground">нет карт</span>
	{/if}
	<h2 class="border-b">Общие карты</h2>
	{#if data.publicCards}
		<ItemGrid>
			{#each levelFilter ? data.publicCards.filter((card) => card.level >= sliderVal[0] && card.level <= sliderVal[1]) : data.publicCards as card}
				<CardItem cardInfo={card} />
			{/each}
		</ItemGrid>
	{:else}
		<span class="text-xl text-muted-foreground">нет карт</span>
	{/if}
</section>
