<script lang="ts">
	import { zodClient } from 'sveltekit-superforms/adapters';
	import SuperDebug, { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { createCardSchema } from '$lib/config/zod-schemas';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import SimpleForm from '../SimpleForm.svelte';
	import SimpleSubmit from '../SimpleSubmit.svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import * as Select from '$lib/components/ui/select/index.js';
	import type { Deck } from '$lib/server/database/schema';
	import SimpleCheckbox from '../SimpleCheckbox.svelte';
	import { BLOCK_TYPES } from '$lib/config/constants';
	import { onMount } from 'svelte';

	export let data: SuperValidated<any>; //подумать super validated
	export let action: string = '';
	export let decks: Deck[] | null = null;

	const form = superForm(data, {
		validators: zodClient(createCardSchema),
		dataType: 'json'
	});

	const { form: formData } = form;
	const inputs = [
		{
			name: 'topicName',
			label: 'Топик'
		}
	];
	let blocksTypeBind: { value: string }[] = [];
	//а ведь ещё удаление нужно...
	const addBlock = () => {
		$formData.blocks = [...$formData.blocks, { content: '' }];
		blocksTypeBind = [...blocksTypeBind, { value: 'text' }];
	};
	$formData.topicName = $page.url.searchParams.get('topic') || '';

	//find related
	$: if (browser && $formData.topicName !== $page.url.searchParams.get('topic') ) {
		console.log('looping');
		const url = new URL($page.url);
		url.searchParams.set('topic', $formData.topicName);
		goto(url, {
			keepFocus: true
		});
	}

	let chosenDeck = { value: undefined };
	$: if (!$formData.addToStudy) {
		chosenDeck = { value: undefined };
		$formData.studyDeckId = undefined;
	}
</script>

<SimpleForm {form} {inputs} {action}>
	<div slot="header">
		<Card.Title class="text-2xl">Создание карты</Card.Title>
	</div>
	<div slot="custom-fields">
		<!---нет ошибки на пустые блоки-->
		{#each $formData.blocks as block, i}
			<Form.Field {form} name="blocks">
				<Form.Control let:attrs>
					<Form.Label>Блок {i + 1}</Form.Label>
					<Input {...attrs} bind:value={block.content} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="studyDeckId">
				<Form.Control let:attrs>
					<Form.Label>Выберите тип блока</Form.Label>
					<Select.Root
						selected={blocksTypeBind[i]}
						onSelectedChange={(v) => {
							v && (block.type = v.value);
						}}>
						<Select.Trigger {...attrs}>
							<Select.Value placeholder="тип" />
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								{#each BLOCK_TYPES as type}
									<Select.Item value={type} label={type}>
										{type}
									</Select.Item>
								{/each}
							</Select.Group>
						</Select.Content>
						<Select.Input name={attrs.name} />
					</Select.Root>
					<input hidden bind:value={$formData.studyDeckId} name={attrs.name} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		{/each}
		<Form.Field {form} name="blocks">
			<Button variant="secondary" on:click={addBlock} class="block w-full">Добавить блок</Button>
			<Form.FieldErrors />
		</Form.Field>
		<br />
		{#if decks}
			<SimpleCheckbox {form} name="addToStudy" label="Добавить в изучение" />
			{#if $formData.addToStudy}
				<br />
				<Form.Field {form} name="studyDeckId">
					<Form.Control let:attrs>
						<Form.Label>Выберите колоду</Form.Label>
						<Select.Root
							selected={chosenDeck}
							onSelectedChange={(v) => {
								v && ($formData.studyDeckId = v.value);
							}}>
							<Select.Trigger {...attrs}>
								<Select.Value placeholder="Колода" />
							</Select.Trigger>
							<Select.Content>
								<Select.Group>
									{#each decks as deck}
										<Select.Item value={deck.id} label={deck.name}>
											{deck.name}
										</Select.Item>
									{/each}
								</Select.Group>
							</Select.Content>
							<Select.Input name={attrs.name} />
						</Select.Root>
						<input hidden bind:value={$formData.studyDeckId} name={attrs.name} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			{/if}
		{/if}
	</div>
	<div slot="submit" class="block w-full">
		<SimpleSubmit {form}>Создать</SimpleSubmit>
	</div>
</SimpleForm>
