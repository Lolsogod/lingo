<script lang="ts">
	import { Card, CardContent } from '$lib/components/ui/card';
	import type { Block } from '$lib/server/database/schema';

	export let blockInfo: Block;
</script>

<Card class="flex cursor-pointer flex-col ">
	<CardContent class="flex h-12 flex-1 items-center justify-center p-2">
		{#if blockInfo.type === 'text'}
			<h2 class="scroll-m-20 pb-2 text-3xl tracking-tight transition-colors first:mt-0">
				{blockInfo.content}
			</h2>
		{:else if blockInfo.type === 'image'}
			<img src={blockInfo.content} alt="" class="h-48 w-full object-cover" />
		{:else if blockInfo.type === 'audio'}
			<audio controls src={blockInfo.content} />
		{/if}
		<!--в слот мб-->
	</CardContent>
	<slot />
</Card>
