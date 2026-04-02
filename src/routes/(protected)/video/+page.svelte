<section class="mx-auto w-[1000px]">
	{#await import('$lib/components/video/Player.svelte') then { default: Player }}
		<Player />
	{/await}
	<br />
</section>
