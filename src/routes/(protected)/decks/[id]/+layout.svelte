<script lang="ts">
import { Button } from '$lib/components/ui/button';
import { superForm } from 'sveltekit-superforms';
import { zodClient } from 'sveltekit-superforms/adapters';
import { startStudySchema } from '$lib/config/zod-schemas';
import type { LayoutData } from './$types';
import ActionButton from '$lib/components/forms/ActionButton.svelte';
import CardItem from '$lib/components/items/CardItem.svelte';
import ItemGrid from '$lib/components/items/ItemGrid.svelte';
import { page } from '$app/stores';
export let data: LayoutData;

const form = superForm(data.startStudyForm, {
	validators: zodClient(startStudySchema)
});
const deck_url = `/decks/${data.deck.id}`;
</script>

<section class="container grid items-center gap-6">
	<div class="flex gap-5">
		<h1 class="flex-1 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
			Колода {data.deck.name}
		</h1>
		<ActionButton
			form={form}
			action={`${deck_url}?/startStudy`}
			name="startStudy"
			condition={!!data.alredyStudying}
			conditionText={'В изучении'}
		>
			Добавить в изучение
		</ActionButton>
	</div>
	<p>
		{data.deck.description||''}
	</p>
	<h2
		class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
	>
		Список карт <!---доделать-->
	</h2>
	<ItemGrid>
		{#each data.cards as card}
			<CardItem cardInfo={card} />
		{/each}
	</ItemGrid>
	<div class="flex gap-2">
		<Button
			href={`${deck_url}/create-card`}
			variant={$page.url.pathname===`${deck_url}/create-card`?'default':'secondary'}
			>Создать карту</Button
		>
		<Button
			href={`${deck_url}/add-card`}
			variant={$page.url.pathname===`${deck_url}/add-card`?'default':'secondary'}
			>Добавить существующюю</Button
		>
		{#if $page.url.pathname!=deck_url}
			<Button href={deck_url} variant="secondary">✕</Button>
		{/if}
	</div>
	<slot />
</section>
