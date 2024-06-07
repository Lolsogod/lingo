<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import {
		deleteDeckSchema,
		dislikeSchema,
		likeSchema,
		startStudySchema
	} from '$lib/config/zod-schemas';
	import type { LayoutData } from './$types';
	import ActionButton from '$lib/components/forms/ActionButton.svelte';
	import CardItem from '$lib/components/items/CardItem.svelte';
	import ItemGrid from '$lib/components/items/ItemGrid.svelte';
	import { page } from '$app/stores';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Input } from '$lib/components/ui/input';
	import { ThumbsUp, ThumbsDown } from 'lucide-svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Search } from 'lucide-svelte';

	export let data: LayoutData;

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

	const starStudyForm = superForm(data.startStudyForm, {
		validators: zodClient(startStudySchema)
	});
	const deleteDeckForm = superForm(data.deleteDeckForm, {
		validators: zodClient(deleteDeckSchema)
	});

	const likeForm = superForm(data.likeForm, {
		validators: zodClient(likeSchema)
	});
	const dislikeForm = superForm(data.dislikeForm, {
		validators: zodClient(dislikeSchema)
	});

	const deck_url = `/decks/${data.deck.id}`;

	$: likeStatus = data.likeStatus ? (data.likeStatus.liked ? 'liked' : 'disliked') : 'unrated';
	$: liked = likeStatus === 'liked';
	$: disliked = likeStatus === 'disliked';
</script>

<section class="container grid items-center gap-6">
	<div class="flex gap-5">
		<h1 class="flex-1">
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
	<div class="flex flex-wrap gap-2">
		{#if data.deckTags?.length > 0}
			{#each data.deckTags as tag}
				<Badge href="/decks/browse?tag={tag}">{tag}</Badge>
			{/each}
			<Badge href="/decks/browse?tag={data.deckTags}" variant="outline" title="Поиск по всем тегам"
				><Search class="h-4 w-4" /></Badge>
		{/if}
	</div>

	<div class="flex gap-4">
		<ActionButton
			form={likeForm}
			action="{deck_url}?/{liked ? 'unrate' : 'rate'}"
			values={[{ name: 'liked', value: true }]}
			variant={liked ? 'default' : 'secondary'}>
			<span class="flex items-center gap-1 text-xl"
				><ThumbsUp />
				{data.likes.length}</span>
		</ActionButton>
		<ActionButton
			form={dislikeForm}
			action="{deck_url}?/{disliked ? 'unrate' : 'rate'}"
			values={[{ name: 'liked', value: false }]}
			variant={disliked ? 'default' : 'secondary'}>
			<span class="flex items-center gap-1 text-xl"
				><ThumbsDown />
				{data.dislikes.length}</span>
		</ActionButton>
	</div>
	<span class="text-lg text-muted-foreground">Рейтинг колоды: {data.rating}</span>
	<h2 class="border-b">
		Список карт <!---доделать-->
	</h2>
	<div class="flex gap-2">
		<Input placeholder="поиск" class="max-w-xs" bind:value={query} />
		<Input placeholder="теги (через запятую)" class="max-w-xs" bind:value={tagQuery} />
	</div>
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
