<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as Button from '$lib/components/ui/button';

	interface Props {
		users: ({ id: string; fullName: string } & { rating?: number })[];
	}

	let { users }: Props = $props();
</script>

{#if users.length > 0}
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
				{#each users as user (user.id)}
					<Table.Row class={(user.rating ?? 0) < 0 ? 'text-red-500' : ''}>
						<Table.Cell class="font-mono text-xs">{user.id}</Table.Cell>
						<Table.Cell>{user.fullName}</Table.Cell>
						<Table.Cell>{user.rating ?? 0}</Table.Cell>
						<Table.Cell>
							<Button.Root size="sm" onclick={() => console.log(user.id)}>Открыть</Button.Root>
						</Table.Cell>
						<Table.Cell>
							<Button.Root size="sm" variant="destructive" onclick={() => console.log(user.id)}>Удалить</Button.Root>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
{:else}
	<span class="text-muted-foreground">Нет данных</span>
{/if}
