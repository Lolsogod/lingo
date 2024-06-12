<section class="mx-auto w-[1000px]">
	{#await import('$lib/components/video/Player.svelte') then { default: Player }}
		<svelte:component this={Player} />
	{/await}
	<br />
</section>
