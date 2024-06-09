<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import VideoItem from './VideoItem.svelte';
	export let data: PageData;
</script>

<section class="mx-auto w-[1000px]">
	{#await import('$lib/components/video/Player.svelte') then { default: Player }}
		<svelte:component this={Player} />
	{/await}
	<br />
</section>
