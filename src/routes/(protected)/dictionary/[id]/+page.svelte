<script lang="ts">
	import type { PageData } from './$types';
	import SearchResult from '../SearchResult.svelte';
    import { Button } from "$lib/components/ui/button"
    
	export let data: PageData;

</script>

<section class="mx-auto flex max-w-3xl flex-col items-start justify-center gap-4">
    <Button href="/dictionary" variant="secondary">Назад</Button>
	{#if data.word}<SearchResult rawWord={data.word} />{/if}
</section>
