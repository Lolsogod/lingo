<!-- Start of Selection -->
<script lang="ts">
	let className: string = '';
	export { className as class };
</script>

<div class="auto-grid {className}">
	<slot />
</div>

<style>
	.auto-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
		grid-gap: 1rem;
	}
</style>
