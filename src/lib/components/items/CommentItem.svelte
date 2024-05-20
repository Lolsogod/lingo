<script lang="ts">
	import { Card, CardContent, CardFooter, CardHeader } from '$lib/components/ui/card';
	import type { Block } from '$lib/server/database/schema';
	import { ThumbsDown, ThumbsUp } from 'lucide-svelte';
	import Button from '../ui/button/button.svelte';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import ActionButton from '../forms/ActionButton.svelte';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { blockLikeSchema } from '$lib/config/zod-schemas';


	export let blockInfo: Block;
	export let data: {
		likeForm: SuperValidated<any>;
		dislikeForm: SuperValidated<any>;
		likeStatus: 'liked' | 'disliked' | 'unrated';
		likes: any[];
		dislikes: any[];
		rating: number;
	};
	export let url: string;

	const likeForm = superForm(data.likeForm, {
		validators: zodClient(blockLikeSchema)
	});
	const dislikeForm = superForm(data.dislikeForm, {
		validators: zodClient(blockLikeSchema)
	});

	$: liked = data.likeStatus === 'liked';
	$: disliked = data.likeStatus === 'disliked';
</script>

<Card class="flex flex-col">
	<CardHeader class="flex flex-row justify-between text-muted-foreground">
		<span>User name</span>
		<span>Рейтинг: {data.rating}</span>
	</CardHeader>
	<CardContent class="flex flex-1">
		{#if blockInfo.type === 'text'}
			<h4>
				{blockInfo.content}
			</h4>
		{:else if blockInfo.type === 'image'}
			<img src={blockInfo.content} alt="" class="w-48 rounded-lg object-cover" />
		{:else if blockInfo.type === 'audio'}
			<audio controls src={blockInfo.content} />
		{/if}
	</CardContent>
	<CardFooter class="flex justify-between">
		<span class="text-muted-foreground">{blockInfo.createdAt.toLocaleString()}</span>
		<div class="flex gap-4">
			<ActionButton
			form={likeForm}
			action="{url}?/{liked ? 'unrate' : 'rate'}"
			values={[{ name: 'liked', value: true }, {name: 'blockId', value: blockInfo.id}]}
			variant={liked ? 'default' : 'secondary'}>
			<span class="flex items-center gap-1 text-xl"
				><ThumbsUp />
				{data.likes.length}</span>
		</ActionButton>
		<ActionButton
			form={dislikeForm}
			action="{url}?/{disliked ? 'unrate' : 'rate'}"
			values={[{ name: 'liked', value: false }, {name: 'blockId', value: blockInfo.id}]}
			variant={disliked ? 'default' : 'secondary'}>
			<span class="flex items-center gap-1 text-xl"
				><ThumbsDown />
				{data.dislikes.length}</span>
		</ActionButton>
		</div>
	</CardFooter>
</Card>
