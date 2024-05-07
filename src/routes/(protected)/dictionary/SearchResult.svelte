<script lang="ts">
	import type { Word } from './types';
	import * as Card from '$lib/components/ui/card';
	import Button from '$lib/components/ui/button/button.svelte';

	export let rawWord: Word;
	export let detailed = false;
	interface ProcessedWord {
		title: string;
		subTitle: string;
		alt: { text: string }[];
		meanings: any[];
	}
	const process = (rawWord: Word) => {
		const word: ProcessedWord = {
			title: '',
			subTitle: '',
			alt: [],
			meanings: []
		};
		if (rawWord.kanji.length > 0) {
			word.title = rawWord.kanji[0].text;
			word.alt = rawWord.kanji.slice(1);
			if (rawWord.kana.length > 0) {
				word.subTitle = rawWord.kana[0].text;
			}
		} else {
			word.title = rawWord.kana[0].text;
			word.alt = rawWord.kana.slice(1);
		}
		if (rawWord.sense.length > 0) {
			word.meanings = rawWord.sense.flatMap((sense) => sense.gloss.map((gloss) => gloss.text));
		}

		return word;
	};
	const word = process(rawWord);
	console.log(rawWord);
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
				<Button href="/cards/create?base={encodeURIComponent(JSON.stringify(word))}&topic={word.title}"
					>Создать карту на основе слова</Button>
			</Card.Footer>
		{/if}
	</Card.Root>
</a>
