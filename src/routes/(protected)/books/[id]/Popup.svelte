<script lang="ts">
	import type { Word } from '../../dictionary/types';
	import SearchResult from '../../dictionary/SearchResult.svelte';
	import { Button } from '$lib/components/ui/button';

	interface Props {
		text?: string;
		x?: number;
		y?: number;
		results?: Word[];
		isVisible?: boolean;
		ref: any;
		onclick?: () => void;
	}

	let {
		text = '',
		x = 0,
		y = 0,
		results = [],
		isVisible = false,
		ref = $bindable(),
		onclick
	}: Props = $props();
</script>

{#if isVisible}
	<!-- Use isVisible to conditionally render the popup -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div {onclick} class="fixed inset-0 z-0">
		<!-- Backdrop covering the entire viewport -->
		<!-- Prevent click inside the popup from closing it -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			bind:offsetHeight={ref}
			class="popup absolute z-10 rounded-md border border-black bg-secondary p-3 shadow-md"
			style="left: {x}px; top: {y}px;">
			<div class="flex items-center justify-between pb-2">
				<h4>{text}</h4>
				<Button href="/cards/create?topic={text}" class="ml-5">Создать карту</Button>
			</div>
			{#if results.length === 0}
				<p>Нет результатов</p>
			{:else}
				<div class="max-h-80 overflow-y-scroll" style="scrollbar-width: none;">
					{#each results as word (word.id)}
						<SearchResult rawWord={word} />
					{/each}
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.popup {
		position: fixed; /* Use fixed to ensure it's positioned relative to the viewport */
	}
</style>
