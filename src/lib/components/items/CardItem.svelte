<script lang="ts">
	import type { CardExp } from '$lib/server/database/schema';
	import CalendarDays from 'lucide-svelte/icons/calendar-days';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import * as Card from '$lib/components/ui/card';
	import * as HoverCard from '$lib/components/ui/hover-card/index.js';
	import BlockItem from './BlockItem.svelte';
	import { declOfNum } from '$lib/_helpers/declOfNum';
	import { Badge } from '../ui/badge';
	import { Search } from 'lucide-svelte';
	export let cardInfo: CardExp;
</script>

<HoverCard.Root>
	<HoverCard.Trigger href={`/cards/${cardInfo.id}`} target="_blank" rel="noreferrer noopener">
		<Card.Root class="flex h-52 w-36 cursor-pointer flex-col ">
			<Card.Content class="flex h-12 flex-1 items-center justify-center p-2">
				<span class="truncate text-2xl">{cardInfo.topic.name}</span>
				<!--в слот мб-->
			</Card.Content>
			<slot />
		</Card.Root>
	</HoverCard.Trigger>
	<HoverCard.Content class="w-[380px]">
		<Card.Root class="w-[350px]">
			<Card.Header>
				<div class="flex flex-wrap gap-2">
					{#if cardInfo.tags?.length > 0}
						{#each cardInfo.tags as tag}
							<Badge href="/cards/browse?tag={tag}">{tag}</Badge>
						{/each}
						<Badge
							href="/cards/browse?tag={cardInfo.tags}"
							variant="outline"
							title="Поиск по всем тегам"><Search class="h-4 w-4" /></Badge>
					{/if}
				</div>
				<Card.Title>
					<h1>{cardInfo.topic.name}</h1>
				</Card.Title>
				<Card.Description
					><a href={`/dictionary/?q=${cardInfo.topic.name}`}>Открыть словарь</a></Card.Description>
			</Card.Header>
			<Card.Content class="flex flex-col gap-2">
				{#each cardInfo.cardBlocks || [] as cb}
					<BlockItem blockInfo={cb.block} />
				{/each}
			</Card.Content>
			<Card.Footer class="flex flex-col items-start">
				{#if cardInfo.cardDeck}
					<p class="text-sm text-muted-foreground">
						Добавленна в {cardInfo.cardDeck.length}
						{declOfNum(cardInfo.cardDeck.length, ['колоду', 'колоды', 'колод'])}
					</p>
				{/if}
			</Card.Footer>
		</Card.Root>
	</HoverCard.Content>
</HoverCard.Root>
