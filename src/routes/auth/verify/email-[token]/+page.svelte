<script lang="ts">
	import { Loader2 } from 'lucide-svelte';
	import type { PageData } from './$types';
	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<section class="container grid items-center gap-6">
	<div class="flex max-w-[980px] flex-col items-start gap-2">
		{#if data.heading}
			<h1>
				{data.heading}
			</h1>
		{/if}
		{#if data.message}
			<p class="max-w-[700px] text-lg text-muted-foreground">{data.message}</p>
		{:else}
			<Loader2 class="mr-2 h-12 w-12 animate-spin" />
		{/if}
	</div>
</section>
