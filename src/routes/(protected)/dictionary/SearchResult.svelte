<script lang="ts">
	import type { Word } from './types';
	import { process } from './processWord';
	import * as Card from '$lib/components/ui/card';
	import Button from '$lib/components/ui/button/button.svelte';

	export let rawWord: Word;
	export let detailed = false;
	const word = process(rawWord);
</script>

<a href={`/dictionary/${rawWord.id}`}>
	<Card.Root class="w-full">
		<Card.Header class="pb-2">
			<Card.Title>
				<h2 class="inline-block">{word.title}</h2>
				{#if word.subTitle.length > 0}
					<span class="opacity-70">( {word.subTitle} )</span>
				{/if}
			</Card.Title>
			{#if word.alt.length > 0}
				Альт. {word.alt.map((alt) => alt.text).join(', ')}
			{/if}
		</Card.Header>
		<Card.Content class="flex flex-col gap-2">
			{#each word.meanings as meaning, i}
				<p>{meaning}</p>
			{/each}
		</Card.Content>
		{#if detailed}
			<Card.Footer class="flex justify-between">
				<Button
					href="/cards/create?base={encodeURIComponent(JSON.stringify(word))}&topic={word.title}"
					>Создать карту на основе слова</Button>
			</Card.Footer>
		{/if}
	</Card.Root>
</a>
