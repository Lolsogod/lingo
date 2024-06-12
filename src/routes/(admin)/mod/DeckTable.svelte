<script lang="ts">
	import { createTable, Render, Subscribe } from 'svelte-headless-table';
	import { readable } from 'svelte/store';
	import * as Table from '$lib/components/ui/table';
	import * as Button from '$lib/components/ui/button';
	import type { Deck } from '$lib/server/database/schema';
	import { enhance } from '$app/forms';
	import * as Form from '$lib/components/ui/form';
    export let decks: (Deck & {rating?: number})[]

	const declTable = createTable(readable(decks));

	const deckColumns = declTable.createColumns([
		declTable.column({
			accessor: 'id',
			header: 'ID'
		}),
		declTable.column({
			accessor: 'name',
			header: 'Имя'
		}),
		declTable.column({
			accessor: 'rating',
			header: 'Рейтинг'
		})
	]);
	const { headerRows, pageRows, tableAttrs, tableBodyAttrs } =
		declTable.createViewModel(deckColumns);
</script>
{#if decks.length > 0}
<div class="rounded-md border">
	<Table.Root {...$tableAttrs}>
		<Table.Header>
			{#each $headerRows as headerRow}
				<Subscribe rowAttrs={headerRow.attrs()}>
					<Table.Row>
						{#each headerRow.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
								<Table.Head {...attrs}>
									<Render of={cell.render()} />
								</Table.Head>
							</Subscribe>
						{/each}
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Header>
		<Table.Body {...$tableBodyAttrs}>
			{#each $pageRows as row (row.id)}
				<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
					<Table.Row {...rowAttrs} class={row.cells[2].value < 0 ? 'text-red-500' : ''}>
						{#each row.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs>
								<Table.Cell {...attrs}>
									<Render of={cell.render()} />
								</Table.Cell>
							</Subscribe>
						{/each}
						<Table.Cell>
							<Button.Root href={`/decks/${row.cells[0].value}`}>Открыть</Button.Root>
						</Table.Cell>
						<Table.Cell>
							<form method="POST" action="/mod?/deleteDeck" use:enhance >
								<input type="hidden" name="deckId" value={row.cells[0].value}>
								<Form.Button variant="destructive">Удалить</Form.Button>
							</form>
						</Table.Cell>
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Body>
	</Table.Root>
	</div>
{:else}
	<span class="text-muted-foreground">Нет данных</span>
{/if}

