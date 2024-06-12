<script lang="ts">
	import { createTable, Render, Subscribe } from 'svelte-headless-table';
	import { readable } from 'svelte/store';
	import * as Table from '$lib/components/ui/table';
	import * as Button from '$lib/components/ui/button';
	import type { Block, Card, CardExp, Topic, User } from '$lib/server/database/schema';
    export let users: ({id: string, fullName: string} & { rating?: number })[]

	const table = createTable(readable(users));

	const deckColumns = table.createColumns([
		table.column({
			accessor: 'id',
			header: 'ID'
		}),
		table.column({
			accessor: 'fullName',
			header: 'Имя'
		}),
		table.column({
			accessor: 'rating',
			header: 'Рейтинг'
		})
	]);
	const { headerRows, pageRows, tableAttrs, tableBodyAttrs } =
		table.createViewModel(deckColumns);
</script>
{#if users.length > 0}
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
							<Button.Root on:click={() => console.log(row.cells[0].value)}>Открыть</Button.Root>
						</Table.Cell>
						<Table.Cell>
							<Button.Root variant="destructive" on:click={() => console.log(row.cells[0].value)}>Удалить</Button.Root>
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
