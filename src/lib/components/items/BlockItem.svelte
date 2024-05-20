<script lang="ts">
	import { Card, CardContent } from '$lib/components/ui/card';
	import type { Block } from '$lib/server/database/schema';
	import Button from '../ui/button/button.svelte';

	export let blockInfo: Block & {
		liked: boolean;
		likes: number;
		dislikes: number;
		rating: number;
	};
	export let add: boolean = false;
	export let added: boolean = false;
</script>

<Card class="flex cursor-pointer p-4 {blockInfo.liked ? 'border-2 border-green-500' : ''}">
	<CardContent class="flex flex-1  p-2">
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
	{#if add}
	<div class="flex flex-col gap-2">
		{#if !added}
			<Button on:click class="m-2">+</Button>
		{:else}
			<Button class="m-2" disabled>✔</Button>
		{/if}
		<span>рейтинг: {blockInfo.rating}</span>
	</div>
	{/if}
</Card>
