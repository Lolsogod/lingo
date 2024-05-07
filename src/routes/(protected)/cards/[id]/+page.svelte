<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { declOfNum } from '$lib/_helpers/declOfNum';
	import BlockItem from '$lib/components/items/BlockItem.svelte';
	export let data: PageData;
	console.log(data.card);
</script>

<section class="container grid items-center gap-6">
	<Card.Root class="w-[350px]">
		<Card.Header>
			<Card.Title>
				<h1>{data.card?.topic.name}</h1>
			</Card.Title>
			<Card.Description><a href={`/dictionary/?q=${data.card?.topic.name}`}>Открыть словарь</a></Card.Description>
		</Card.Header>
		<Card.Content class="flex flex-col gap-2">
			{#each data.card.cardBlocks as cb}
				<BlockItem blockInfo={cb.block} />
			{/each}
		</Card.Content>
		<Card.Footer class="flex flex-col items-start">
			<p class="text-muted-foreground text-sm">
				Добавленна в {data.card.cardDeck.length}
				{declOfNum(data.card.cardDeck.length, ['колоду', 'колоды', 'колод'])}
			</p>
			<p class="text-muted-foreground text-sm">
				Изучает {data.card.studyCard.length}
				{declOfNum(data.card.studyCard.length, ['пользователь', 'пользователя', 'пользователей'])}
			</p>
			<p class="text-muted-foreground text-sm">
				Cложность {data.avgDiff}
			</p>
		</Card.Footer>
	</Card.Root>
</section>
