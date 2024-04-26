<script>
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent } from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
</script>

<Dialog.Root>
	<Dialog.Trigger>
		<Card class="flex h-52 w-36 cursor-pointer flex-col border-dashed">
			<CardContent class="flex h-12 flex-1 items-center justify-center p-0">
				<span class="text-3xl">+</span>
			</CardContent>
		</Card>
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Добавление колоды</Dialog.Title>
			<Dialog.Description>Создайте новую колоду или добавьте существующую</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<a href="/decks/create"><Button>Создать новую колоду</Button></a>
			<a href="/decks/browse"><Button>Добавить существующую</Button></a>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
