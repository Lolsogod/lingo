<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent } from '$lib/components/ui/card';
	import CardFooter from '$lib/components/ui/card/card-footer.svelte';
	import CardHeader from '$lib/components/ui/card/card-header.svelte';
	import type { Deck } from '$lib/server/database/schema';
	import { Lock } from 'lucide-svelte';
	export let deckInfo: Deck;
</script>

<a href="/decks/{deckInfo.id}">
	<Card class="flex h-52 w-36 cursor-pointer flex-col ">
		<CardHeader class="flex h-6 items-end p-1">
			{#if !deckInfo.public}
				<!--TODO: create tooltip component-->
				<Lock class="mr-2 h-4 w-4 text-gray-500" />
			{/if}
		</CardHeader>
		<CardContent class="flex h-12 flex-1 items-center justify-center p-2">
			<span class="truncate text-2xl">{deckInfo.name}</span>
		</CardContent>
		<CardFooter>
			<!--just demo modify after making buttonform-->
			<Button>Добавить</Button>
		</CardFooter>
	</Card>
</a>
