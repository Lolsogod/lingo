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
	import { Label } from "$lib/components/ui/label/index.js";
  import { Switch } from "$lib/components/ui/switch/index.js";
	import SuperDebug from 'sveltekit-superforms'
	const word_url = `/dictionary/${data.word.id}`
	const commentForm = superForm(data.commentForm, {
		validators: zodClient(commentSchema)
	});
	let isMd = false
	const { form: formData} = commentForm
	$: $formData.type = isMd ? 'markdown' : 'text'
	$: inputs = [
		{
			name: 'topicId',
			type: 'hidden'
		},
		{
			name: 'comment',
			label: 'Оставить комментарий',
			type: isMd ? 'markdown' : 'text'
		},
		{
			name: 'potentialTopicName',
			type: 'hidden'
		},
		{
			name: 'type',
			type: 'hidden'
		}
	];
</script>
<SuperDebug data={formData} />
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
	<div class="flex items-center space-x-2">
		<Switch bind:checked={isMd} /> 
		<Label for="airplane-mode">Режим разметки</Label>
	  </div>
	
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
