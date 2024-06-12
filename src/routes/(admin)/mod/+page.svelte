<script lang="ts">
	import type { PageData } from './$types';
	import CardTable from './CardTable.svelte';
	import DeckTable from './DeckTable.svelte';
	import BlockTable from './BlockTable.svelte';
	import UserTable from './UserTable.svelte';
	import { Switch } from '$lib/components/ui/switch';
	export let data: PageData;

	let displayAllUsers = false;
	let displayAllBlocks = false;
	let displayAllCards = false;
	let displayAllDecks = false;
</script>

<section class="container grid items-center gap-6">
	<h1>Панель модератора</h1>
	<div class="flex items-center gap-2 border-b">
		<h2>Колоды</h2>
		<Switch bind:checked={displayAllDecks}/>
        <span>Отображать все</span>
	</div>
	{#key displayAllDecks || data.decks}
		<DeckTable decks={displayAllDecks ? data.decks : data.decks.filter(deck => (deck.rating ?? 0) < 0)} />
	{/key}
	<div class="flex items-center gap-2 border-b">
		<h2>Карты</h2>
		<Switch bind:checked={displayAllCards} />
		<span>Отображать все</span>
	</div>
	{#key displayAllCards || data.cards}
		<CardTable cards={displayAllCards ? data.cards : data.cards.filter(card => (card.rating ?? 0) < 0)} />
	{/key}
	<div class="flex items-center gap-2 border-b">
		<h2>Коментарии</h2>
		<Switch bind:checked={displayAllBlocks} />
		<span>Отображать все</span>
	</div>
	{#key displayAllBlocks}
		<BlockTable blocks={displayAllBlocks ? data.blocks : data.blocks.filter(block => (block.rating ?? 0) < 0)} />
	{/key}
	<div class="flex items-center gap-2 border-b">
		<h2>Пользователи</h2>
		<Switch bind:checked={displayAllUsers} />
		<span>Отображать все</span>
	</div>
	{#key displayAllUsers}
		<UserTable users={displayAllUsers ? data.users : data.users.filter(user => (user.rating ?? 0) < 0)} />
	{/key}
</section>
