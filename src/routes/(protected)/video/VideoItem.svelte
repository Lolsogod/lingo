<script lang="ts">
	import { Trash } from 'lucide-svelte';
	import * as Card from '$lib/components/ui/card';
	import Button from '$lib/components/ui/button/button.svelte';
	import { createEventDispatcher } from 'svelte';

	export let video: { url: string; title: string; thumbnail: string };
	export let canDelete: boolean = false;

	const dispatch = createEventDispatcher();
	function removeVideoFromHistory(url: string) {
		let history = JSON.parse(localStorage.getItem('videoInfo') || '[]') || [];
		history = history.filter((item: { url: string }) => item.url !== url);
		localStorage.setItem('videoInfo', JSON.stringify(history));
		dispatch('deleted');
	}
</script>

<Card.Root class="group relative w-80 overflow-hidden">
	{#if canDelete}
		<Button
			class="absolute right-0 top-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
			variant="destructive"
			on:click={() => removeVideoFromHistory(video.url)}>
			<Trash size={20} />
		</Button>
	{/if}
	<a href={video.url}>
		<img src={video.thumbnail} alt="cover" class=" bg-gray-500 object-cover" />

		<div class="p-2">
			<h4 class="truncate">{video.title}</h4>
		</div>
	</a>
</Card.Root>
