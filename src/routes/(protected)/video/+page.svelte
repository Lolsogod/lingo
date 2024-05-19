<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<section class="mx-auto w-[1000px]">
	{#await import('$lib/components/video/Player.svelte') then { default: Player }}
		<svelte:component this={Player} />
	{/await}
</section>
