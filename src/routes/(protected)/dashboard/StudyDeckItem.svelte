<script lang="ts">
	import { Card, CardContent } from '$lib/components/ui/card';
	import CardFooter from '$lib/components/ui/card/card-footer.svelte';
	import type { StudyDeckExp } from '$lib/server/database/schema';
	import CardCounterMini from '../../../lib/components/srs/CardCounterMini.svelte';
	export let deckInfo: StudyDeckExp;
</script>

<a href="/study/{deckInfo.id}">
	<Card class="flex h-52 w-36 cursor-pointer flex-col ">
		<CardContent class="flex h-12 flex-1 items-center justify-center p-2">
			<span class="truncate text-2xl">{deckInfo.deck.name}</span>
		</CardContent>
		<CardFooter class="justify-center">
			<CardCounterMini studyCards={deckInfo.studyCards}/>
		</CardFooter>
	</Card>
</a>
