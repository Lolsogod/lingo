<script lang="ts">
	import StudyDeckItem from './StudyDeckItem.svelte';
	import ItemGrid from '$lib/components/items/ItemGrid.svelte';
	import type { PageData } from './$types';
	import AddDeck from './AddDeck.svelte';
	export let data: PageData;
</script>

<section class="container grid items-center gap-6">
	<h1>Колоды для повторения</h1>
	<ItemGrid>
		{#each data.decksWithQueues as studyDeck}
			<StudyDeckItem deckInfo={studyDeck} />
		{/each}
		<AddDeck />
	</ItemGrid>
</section>
