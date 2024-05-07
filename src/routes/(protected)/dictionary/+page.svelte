<script lang="ts">
	import { onMount } from 'svelte';
	import { createIndex, searchIndex, type Word } from './search';
	import { Input } from '$lib/components/ui/input';

	let search: 'loading' | 'ready' = 'loading';
	let query = '';
	let results: Word[] = [];

	onMount(async () => {
		const words = await fetch('/dictionary.json').then((r) => r.json());
		createIndex(words);
		search = 'ready';
	});

	$: if (search === 'ready') {
		results = searchIndex(query);
		console.log(results);
	}
</script>

{#if search === 'ready'}
	<div class="search">
		<Input bind:value={query} placeholder="Search..." autocomplete="off" />
	</div>

    {#if results}
        <ol>
            {#each results as word}
                <li>{`${word.kanji[0]?.text ?? ''} (${word.kana[0]?.text ?? ''}) - ${word.sense[0]?.gloss[0]?.text ?? ''}`}</li>
            {/each}
        </ol>
    {/if}
{/if}

