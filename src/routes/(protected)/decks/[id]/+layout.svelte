<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { deleteDeckSchema, startStudySchema } from '$lib/config/zod-schemas';
	import type { LayoutData } from './$types';
	import ActionButton from '$lib/components/forms/ActionButton.svelte';
	import CardItem from '$lib/components/items/CardItem.svelte';
	import ItemGrid from '$lib/components/items/ItemGrid.svelte';
	import { page } from '$app/stores';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Input } from '$lib/components/ui/input';

	export let data: LayoutData;

	let query = $page.url.searchParams.get('q') || '';

	$: if (browser && query !== $page.url.searchParams.get('q')) {
		const url = new URL($page.url);
		url.searchParams.set('q', query);
		goto(url, {
			keepFocus: true
		});
	}

	const starStudyForm = superForm(data.startStudyForm, {
		validators: zodClient(startStudySchema)
	});
	const deleteDeckForm = superForm(data.deleteDeckForm, {
		validators: zodClient(deleteDeckSchema)
	});
	const deck_url = `/decks/${data.deck.id}`;
</script>

<section class="container grid items-center gap-6">
	<div class="flex gap-5">
		<h1 class="flex-1 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
			Колода {data.deck.name}
		</h1>
		<ActionButton
			form={starStudyForm}
			action={`${deck_url}?/startStudy`}
			values={[{ name: 'startStudy' }]}
			condition={!!data.alredyStudying}
			conditionText={'В изучении'}>
			Добавить в изучение
		</ActionButton>
		{#if data.canEdit}
			<Button href={`${deck_url}/edit`} variant="secondary">Редактировать</Button>
			<AlertDialog.Root>
				<AlertDialog.Trigger asChild let:builder>
					<Button builders={[builder]} variant="destructive">Удалить</Button>
				</AlertDialog.Trigger>
				<AlertDialog.Content>
					<AlertDialog.Header>
						<AlertDialog.Title>Удалить колоду?</AlertDialog.Title>
						<AlertDialog.Description>
							Это действие нельзя отменить. Оно навсегда удалит эту колоду, только пользователи, уже
							начавшие обучение по ней продолжат иметь доступ к колоде.
						</AlertDialog.Description>
					</AlertDialog.Header>
					<AlertDialog.Footer>
						<AlertDialog.Cancel>Отмена</AlertDialog.Cancel>
						<ActionButton form={deleteDeckForm} action={`${deck_url}?/delete`} values={[]}>
							Удалить
						</ActionButton>
					</AlertDialog.Footer>
				</AlertDialog.Content>
			</AlertDialog.Root>
		{/if}
	</div>
	<p>
		{data.deck.description || ''}
	</p>
	<h2
		class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
		Список карт <!---доделать-->
	</h2>
	<Input placeholder="поиск" class="max-w-xs" bind:value={query} />
	<ItemGrid>
		{#each data.cards as card}
			<CardItem cardInfo={card} />
		{/each}
	</ItemGrid>
	{#if data.canEdit}
		<div class="flex gap-2">
			<Button
				href={`${deck_url}/create-card${query ? `?q=${query}` : ''}`}
				variant={$page.url.pathname === `${deck_url}/create-card` ? 'default' : 'secondary'}
				>Создать карту</Button>
			<Button
				href={`${deck_url}/add-card${query ? `?q=${query}` : ''}`}
				variant={$page.url.pathname === `${deck_url}/add-card` ? 'default' : 'secondary'}
				>Добавить существующюю</Button>
			{#if $page.url.pathname != deck_url}
				<Button href={`${deck_url}${query ? `?q=${query}` : ''}`} variant="secondary">✕</Button>
			{/if}
		</div>
		<slot />
	{/if}
</section>
