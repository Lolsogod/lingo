<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { declOfNum } from '$lib/_helpers/declOfNum';
	import BlockItem from '$lib/components/items/BlockItem.svelte';
	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select';
	import SimpleForm from '$lib/components/forms/SimpleForm.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { addCardToDeckSchema2 } from '$lib/config/zod-schemas';
	import SimpleSubmit from '$lib/components/forms/SimpleSubmit.svelte';

	export let data: PageData;

	const form = superForm(data.addToDeckForm, {
		validators: zodClient(addCardToDeckSchema2)
	});
	const {form: formData} = form;
	let chosenDeck = { value: '' };
</script>

<section class="container grid items-center gap-6">
	<Card.Root class="w-[350px]">
		<Card.Header>
			<Card.Title>
				<h1>{data.card?.topic.name}</h1>
			</Card.Title>
			<Card.Description
				><a href={`/dictionary/?q=${data.card?.topic.name}`}>Открыть словарь</a></Card.Description>
		</Card.Header>
		<Card.Content class="flex flex-col gap-2">
			{#each data.card.cardBlocks as cb}
				<BlockItem blockInfo={cb.block} />
			{/each}
		</Card.Content>
		<Card.Footer class="flex flex-col items-start">
			<p class="text-sm text-muted-foreground">
				Добавленна в {data.card.cardDeck.length}
				{declOfNum(data.card.cardDeck.length, ['колоду', 'колоды', 'колод'])}
			</p>
			<p class="text-sm text-muted-foreground">
				Изучает {data.card.studyCard.length}
				{declOfNum(data.card.studyCard.length, ['пользователь', 'пользователя', 'пользователей'])}
			</p>
			<p class="text-sm text-muted-foreground">
				Cложность {data.avgDiff}
			</p>
		</Card.Footer>
	</Card.Root>
	{#if data.decks}
	<Dialog.Root>
		<Dialog.Trigger
			class={`${buttonVariants({ variant: 'default' })} flex flex-1 flex-col items-center justify-center`}
			disabled={ data.decks.length <= 0}>
			Добавить в колоду
		</Dialog.Trigger>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>Добавить в колоду</Dialog.Title>
				<Dialog.Description class="flex flex-col gap-2">
					<SimpleForm {form}>
						<div slot="custom-fields">
							<Form.Field {form} name="deckId">
								<Form.Control let:attrs>
									<Form.Label>Выберите колоду</Form.Label>
									<Select.Root
										selected={chosenDeck}
										onSelectedChange={(v) => {
											v && ($formData.deckId = v.value);
										}}>
										<Select.Trigger {...attrs}>
											<Select.Value placeholder="Колода" />
										</Select.Trigger>
										<Select.Content>
											<Select.Group>
												{#each data.decks as deck}
													<Select.Item value={deck.id} label={deck.name}>
														{deck.name}
													</Select.Item>
												{/each}
											</Select.Group>
										</Select.Content>
										<Select.Input name={attrs.name} />
									</Select.Root>
									<input hidden bind:value={$formData.deckId} name={attrs.name} />
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
						</div>
						<div slot="submit">
							<SimpleSubmit {form}>Добавить</SimpleSubmit>
						</div>
					</SimpleForm>
				</Dialog.Description>
			</Dialog.Header>
		</Dialog.Content>
	</Dialog.Root>
	{/if}
</section>
