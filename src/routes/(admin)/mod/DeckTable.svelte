<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as Button from '$lib/components/ui/button';
	import type { Deck } from '$lib/server/database/schema';
	import { enhance } from '$app/forms';
	import * as Form from '$lib/components/ui/form';

	interface Props {
		decks: (Deck & { rating?: number })[];
	}

	let { decks }: Props = $props();
</script>

{#if decks.length > 0}
	<div class="rounded-md border">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>ID</Table.Head>
					<Table.Head>Имя</Table.Head>
					<Table.Head>Рейтинг</Table.Head>
					<Table.Head></Table.Head>
					<Table.Head></Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each decks as deck (deck.id)}
					<Table.Row class={(deck.rating ?? 0) < 0 ? 'text-red-500' : ''}>
						<Table.Cell class="font-mono text-xs">{deck.id}</Table.Cell>
						<Table.Cell>{deck.name}</Table.Cell>
						<Table.Cell>{deck.rating ?? 0}</Table.Cell>
						<Table.Cell>
							<Button.Root size="sm" href={`/decks/${deck.id}`}>Открыть</Button.Root>
						</Table.Cell>
						<Table.Cell>
							<form method="POST" action="/mod?/deleteDeck" use:enhance>
								<input type="hidden" name="deckId" value={deck.id} />
								<Button.Root size="sm" variant="destructive" type="submit">Удалить</Button.Root>
							</form>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
{:else}
	<span class="text-muted-foreground">Нет данных</span>
{/if}
