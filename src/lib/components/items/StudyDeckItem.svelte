<script lang="ts">
import { Button } from '$lib/components/ui/button';
import { Card, CardContent } from '$lib/components/ui/card';
import CardFooter from '$lib/components/ui/card/card-footer.svelte';
import CardHeader from '$lib/components/ui/card/card-header.svelte';
import type { StudyDeck } from '$lib/server/database/schema';
import { Lock } from 'lucide-svelte';
export let deckInfo: StudyDeck;
</script>

<a href="/study/{deckInfo.deckId}">
	<Card class="flex h-52 w-36 cursor-pointer flex-col ">
		<CardContent class="flex h-12 flex-1 items-center justify-center p-2">
			<span class="truncate text-2xl">{deckInfo.deck.name}</span>
		</CardContent>
		<CardFooter>
			<!--тут будет стата когда она будет-->
		</CardFooter>
	</Card>
</a>
