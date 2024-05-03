<div class="auto-grid">
	<slot />
</div>

<style>
	.auto-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
		grid-gap: 1rem;
	}
</style>
