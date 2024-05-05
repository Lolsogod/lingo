<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<section class="container grid items-center gap-6">
	<Button href="/cards/browse" class="w-14" variant="secondary">Назад</Button>
	<slot />
</section>
