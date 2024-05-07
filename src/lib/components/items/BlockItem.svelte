<script lang="ts">
	import { Card, CardContent } from '$lib/components/ui/card';
	import type { Block } from '$lib/server/database/schema';
	import Button from '../ui/button/button.svelte';

	export let blockInfo: Block;
	export let add: boolean = false;
</script>

<Card class="flex cursor-pointer">
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
		<Button on:click class="m-2">+</Button>
	{/if}
</Card>
