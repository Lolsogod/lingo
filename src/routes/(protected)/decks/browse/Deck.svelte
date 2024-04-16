<script lang="ts">
import { Card, CardContent } from '$lib/components/ui/card';
import type { Deck } from '$lib/server/database/schema';
export let deckInfo: Deck;
</script>

<a href="/decks/{deckInfo.id}">
	<Card class="flex h-52 w-36 cursor-pointer flex-col">
		<CardContent class="flex h-12 flex-1 items-center justify-center p-0">
			<span class="text-3xl">{deckInfo.name}</span>
		</CardContent>
	</Card>
</a>
