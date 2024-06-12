<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent } from '$lib/components/ui/card';
	import CardFooter from '$lib/components/ui/card/card-footer.svelte';
	import CardHeader from '$lib/components/ui/card/card-header.svelte';
	import { startStudySchema } from '$lib/config/zod-schemas';
	import type { NewDeck } from '$lib/server/database/schema';
	import { Lock } from 'lucide-svelte';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import ActionButton from '../forms/ActionButton.svelte';
	export let deckInfo: NewDeck & {
		level?: number;
		addForm?: SuperValidated<any>;
		alredyStudying?: boolean;
	};
	export let noRedirect = false;
	const deck_url = `/decks/${deckInfo.id}`;

	const form = superForm(deckInfo.addForm, {
		validators: zodClient(startStudySchema)
	});
</script>

{#if noRedirect}
	<Card class="flex h-52 w-36 cursor-pointer flex-col ">
		<CardHeader class="flex h-6 items-end p-1">
			{#if !deckInfo.public}
				<!--TODO: create tooltip component-->
				<Lock class="mr-2 h-4 w-4 text-gray-500" />
			{/if}
		</CardHeader>
		<CardContent class="flex h-12 flex-1 items-center justify-center p-2">
			<span class="truncate text-2xl" title={deckInfo.name}>{deckInfo.name}</span>
		</CardContent>
		<CardFooter class="flex justify-center px-2">
			<!--just demo modify after making buttonform-->
			<ActionButton
				{form}
				action="?/startStudy"
				values={[{ name: 'startStudy' }]}
				condition={deckInfo.alredyStudying}
				conditionText={'Добавлена'}>
				Добавить
			</ActionButton>
		</CardFooter>
	</Card>
{:else}
	<a href="/decks/{deckInfo.id}">
		<Card class="flex h-52 w-36 cursor-pointer flex-col ">
			<CardHeader class="flex h-6 items-end p-1"></CardHeader>
			<CardContent class="flex h-12 flex-1 items-center justify-center p-2">
				<span class="truncate text-2xl" title={deckInfo.name}>{deckInfo.name}</span>
			</CardContent>
			<CardFooter class="flex justify-center px-2">
				<!--just demo modify after making buttonform-->
				<ActionButton
					{form}
					action="{deck_url}?/startStudy"
					values={[{ name: 'startStudy' }]}
					condition={deckInfo.alredyStudying}
					conditionText={'Добавлена'}>
					Добавить
				</ActionButton>
			</CardFooter>
		</Card>
	</a>
{/if}
