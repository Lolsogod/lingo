<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as Button from '$lib/components/ui/button';

	interface Props {
		cards: ({ cardId: string; topicName: string } & { rating?: number })[];
	}

	let { cards }: Props = $props();
</script>

{#if cards.length > 0}
	<div class="rounded-md border">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>ID</Table.Head>
					<Table.Head>Тема</Table.Head>
					<Table.Head>Рейтинг</Table.Head>
					<Table.Head></Table.Head>
					<Table.Head></Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each cards as card (card.cardId)}
					<Table.Row class={(card.rating ?? 0) < 0 ? 'text-red-500' : ''}>
						<Table.Cell class="font-mono text-xs">{card.cardId}</Table.Cell>
						<Table.Cell>{card.topicName}</Table.Cell>
						<Table.Cell>{card.rating ?? 0}</Table.Cell>
						<Table.Cell>
							<Button.Root size="sm" onclick={() => console.log(card.cardId)}>Открыть</Button.Root>
						</Table.Cell>
						<Table.Cell>
							<Button.Root size="sm" variant="destructive" onclick={() => console.log(card.cardId)}>Удалить</Button.Root>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
{:else}
	<span class="text-muted-foreground">Нет данных</span>
{/if}
