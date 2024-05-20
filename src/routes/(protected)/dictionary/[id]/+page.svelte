<script lang="ts">
	import type { PageData } from './$types';
	import SearchResult from '../SearchResult.svelte';
	import { Button } from '$lib/components/ui/button';
	import ItemGrid from '$lib/components/items/ItemGrid.svelte';
	import CardItem from '$lib/components/items/CardItem.svelte';

	export let data: PageData;
	import SimpleForm from '$lib/components/forms/SimpleForm.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { commentSchema } from '$lib/config/zod-schemas';
	import SimpleSubmit from '$lib/components/forms/SimpleSubmit.svelte';
	import CommentItem from '$lib/components/items/CommentItem.svelte';

	const word_url = `/dictionary/${data.word.id}`
	const commentForm = superForm(data.commentForm, {
		validators: zodClient(commentSchema)
	});
	const inputs = [
		{
			name: 'topicId',
			type: 'hidden'
		},
		{
			name: 'comment',
			label: 'Оставить комментарий',
			type: 'textarea'
		},
		{
			name: 'potentialTopicName',
			type: 'hidden'
		}
	];
</script>

<section class="mx-auto flex max-w-3xl flex-col items-start justify-center gap-4">
	<Button href="/dictionary" variant="secondary">Назад</Button>
	<div class="w-full">
		<SearchResult rawWord={data.word} detailed />
	</div>
	{#if data.exactMatchedCards.length > 0}
		<h2 class="text-2xl font-bold">Карты для слова</h2>
		<ItemGrid class="w-full">
			{#each data.exactMatchedCards as card}
				<CardItem cardInfo={card} />
			{/each}
		</ItemGrid>
	{/if}
	{#if data.relatedCards.length > 0}
		<h2 class="text-2xl font-bold">Связанные карты</h2>
		<ItemGrid class="w-full">
			{#each data.relatedCards as card}
				<CardItem cardInfo={card} />
			{/each}
		</ItemGrid>
	{/if}
	{#if data.exactMatchedCards.length === 0 && data.relatedCards.length === 0}
		<p class="text-center text-lg">Нет связанных карт</p>
	{/if}
	<div class="w-full flex flex-col gap-5">
	<h2>Комментарии</h2>
	<SimpleForm form={commentForm} {inputs} class="border-0" innerClass="p-0 gap-0" action='?/comment'>
		<div slot="submit">
			<SimpleSubmit form={commentForm}>Отправить</SimpleSubmit>
		</div>
	</SimpleForm>
	{#if data.commentsData}
		{#each data.commentsData as commentData (commentData.comment.id)}
			<CommentItem data={commentData} url={word_url} />
		{/each}
	{/if}
	</div>	
</section>
