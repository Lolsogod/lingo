<script lang="ts">
	import { Card, CardContent } from '$lib/components/ui/card';
	import type { CardExp } from '$lib/server/database/schema';

	export let cardInfo: CardExp;
</script>

<a href={`/cards/${cardInfo.id}`}>
	<Card class="flex h-52 w-36 cursor-pointer flex-col ">
		<CardContent class="flex h-12 flex-1 items-center justify-center p-2">
			<span class="truncate text-2xl">{cardInfo.topic.name}</span>
			<!--в слот мб-->
		</CardContent>
		<slot />
	</Card>
</a>
