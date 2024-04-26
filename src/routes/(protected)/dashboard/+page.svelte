<script lang="ts">
	import StudyDeckItem from '$lib/components/items/StudyDeckItem.svelte';
	import ItemGrid from '$lib/components/items/ItemGrid.svelte';
	import type { PageData } from './$types';
	import AddDeck from './AddDeck.svelte';
	export let data: PageData;
</script>

<section class="container grid items-center gap-6">
	<h1 class="mb-5 text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
		Колоды для повторения
	</h1>
	<ItemGrid>
		{#each data.decksWithNewCounts as studyDeck}
			<StudyDeckItem deckInfo={studyDeck} newCount={studyDeck.newCount} />
		{/each}
		<AddDeck />
	</ItemGrid>
</section>
