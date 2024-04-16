<script lang="ts">
import type { PageData } from './$types';
import AddDeck from './AddDeck.svelte';
export let data: PageData;
</script>

<section class="container grid items-center gap-6">
	<div class="flex max-w-[980px] flex-col items-start gap-2">
		<h1 class="mb-5 text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
			Колоды для повторения
		</h1>
		<div class="flex gap-10">
			{#each data.studyDecks as studyDeck}
				<span>{studyDeck.deck.name}</span>
				<br />
			{/each}
			<AddDeck />
		</div>
	</div>
</section>
