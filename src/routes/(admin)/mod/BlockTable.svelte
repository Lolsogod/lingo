<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as Button from '$lib/components/ui/button';
	import type { Block } from '$lib/server/database/schema';

	interface Props {
		blocks: (Block & { rating?: number })[];
	}

	let { blocks }: Props = $props();
</script>

{#if blocks.length > 0}
	<div class="rounded-md border">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>ID</Table.Head>
					<Table.Head>Содержание</Table.Head>
					<Table.Head>Рейтинг</Table.Head>
					<Table.Head></Table.Head>
					<Table.Head></Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each blocks as block (block.id)}
					<Table.Row class={(block.rating ?? 0) < 0 ? 'text-red-500' : ''}>
						<Table.Cell class="font-mono text-xs">{block.id}</Table.Cell>
						<Table.Cell class="max-w-xs truncate">{block.content}</Table.Cell>
						<Table.Cell>{block.rating ?? 0}</Table.Cell>
						<Table.Cell>
							<Button.Root size="sm" onclick={() => console.log(block.id)}>Открыть</Button.Root>
						</Table.Cell>
						<Table.Cell>
							<Button.Root size="sm" variant="destructive" onclick={() => console.log(block.id)}>Удалить</Button.Root>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
{:else}
	<span class="text-muted-foreground">Нет данных</span>
{/if}
