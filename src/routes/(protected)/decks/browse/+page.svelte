<script lang="ts">
	import type { PageData } from './$types';
	import DeckItem from '$lib/components/items/DeckItem.svelte';
	import ItemGrid from '$lib/components/items/ItemGrid.svelte';
	import { Input } from '$lib/components/ui/input';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { Switch } from '$lib/components/ui/switch';
	import { Slider } from '$lib/components/ui/slider';
	export let data: PageData;

	let query = $page.url.searchParams.get('q') || ''; //TODO: доделвть
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
		<h1>Все колоды</h1>
		<Button href="create">Создать колоду</Button>
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
	<h2 class="border-b">Мои колоды</h2>

	{#if data.userCreatedDecks}
		<ItemGrid>
			{#each levelFilter ? data.userCreatedDecks.filter((deck) => deck.level != null && deck.level >= sliderVal[0] && deck.level <= sliderVal[1]) : data.userCreatedDecks as deck}
				<DeckItem deckInfo={deck} />
			{/each}
		</ItemGrid>
	{:else}
		<span class="text-xl text-muted-foreground">нет колод</span>
	{/if}
	<h2 class="border-b">Общие колоды</h2>
	{#if data.publicDecks}
		<ItemGrid>
			{#each levelFilter ? data.publicDecks.filter((deck) => deck.level != null && deck.level >= sliderVal[0] && deck.level <= sliderVal[1]) : data.publicDecks as deck}
				<DeckItem deckInfo={deck} />
			{/each}
		</ItemGrid>
	{:else}
		<span class="text-xl text-muted-foreground">нет колод</span>
	{/if}
</section>
