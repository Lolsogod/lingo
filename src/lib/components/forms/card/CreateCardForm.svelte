<script lang="ts">
	import { zodClient } from 'sveltekit-superforms/adapters';
	import SuperDebug, { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { createCardSchema, type CreateCardSchema } from '$lib/config/zod-schemas';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import SimpleForm from '../SimpleForm.svelte';
	import SimpleSubmit from '../SimpleSubmit.svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import * as Select from '$lib/components/ui/select/index.js';
	import type { Block, Deck } from '$lib/server/database/schema';
	import SimpleCheckbox from '../SimpleCheckbox.svelte';
	import { BLOCK_TYPES } from '$lib/config/constants';
	import * as Dialog from '$lib/components/ui/dialog';
	import BlockItem from '$lib/components/items/BlockItem.svelte';

	export let data: SuperValidated<CreateCardSchema>; //подумать super validated
	export let action: string = '';
	export let decks: Deck[] | null = null;
	export let blocks;

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

	//а ведь ещё удаление нужно...
	const addBlock = () => {
		$formData.blocks = [...$formData.blocks, { content: '', isNew: true, type: 'text' }];
	};
	const addExisting = (block: Block) => {
		$formData.blocks = [
			...$formData.blocks,
			{ content: block.content, isNew: false, type: block.type, id: block.id }
		];
	};

	const removeBlock = (index: number) => {
		$formData.blocks = $formData.blocks.filter((_, i) => i !== index);
	};
	$formData.topicName = $page.url.searchParams.get('topic') || '';

	//find related
	$: if (browser && $formData.topicName !== $page.url.searchParams.get('topic')) {
		const url = new URL($page.url);
		url.searchParams.set('topic', $formData.topicName);
		goto(url, {
			keepFocus: true,
			noScroll: true
		});
	}

	let chosenDeck = { value: undefined };
	$: if (!$formData.addToStudy && $formData.studyDeckId) {
		chosenDeck = { value: undefined };
		$formData.studyDeckId = undefined;
	}
</script>

<SimpleForm {form} {inputs} {action}>
	<div slot="header">
		<Card.Title class="text-2xl">Создание карты</Card.Title>
	</div>
	<div slot="custom-fields">
		<Form.Field {form} name="tags" class="mb-5">
			<Form.Control let:attrs>
				<Form.Label>Теги (через запятую)</Form.Label>
				<Input {...attrs} bind:value={$formData.tags} />
			</Form.Control>
		</Form.Field>
		<!---нет ошибки на пустые блоки-->
		{#each $formData.blocks as block, i}
			<div class="flex w-full items-end gap-2">
				<Form.Field {form} name="blocks" class="flex-1">
					<Form.Control let:attrs>
						<Form.Label>Блок {i + 1}</Form.Label>
						<Input {...attrs} bind:value={block.content} disabled={!block.isNew} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="studyDeckId" class="w-1/3">
					<Form.Control let:attrs>
						<Form.Label>Тип блока</Form.Label>
						<Select.Root
							selected={{ value: block.type, label: block.type }}
							onSelectedChange={(v) => {
								v && (block.type = v.value);
							}}>
							<Select.Trigger {...attrs} disabled={!block.isNew}>
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
				<Button variant="destructive" class="mb-2" on:click={() => removeBlock(i)}>X</Button>
			</div>
		{/each}
		<div class="flex gap-2">
			<Form.Field {form} name="blocks" class="flex-1">
				<Button variant="secondary" on:click={addBlock} class="block w-full">Создать блок</Button>
				<Form.FieldErrors />
			</Form.Field>

			<Dialog.Root>
				<Dialog.Trigger
					class={`${buttonVariants({ variant: 'default' })} flex flex-1 flex-col items-center justify-center`}
					disabled={blocks?.length <= 0}>
					Добавить существующий
					<div class="text-xs">Найдено {blocks?.length}</div>
				</Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>Блоки на тему {$formData.topicName}</Dialog.Title>
						<Dialog.Description class="flex h-[500px] flex-col  gap-2 overflow-y-auto">
							{#each blocks as block}
								<BlockItem
									blockInfo={block}
									on:click={() => addExisting(block)}
									add
									added={$formData.blocks.some((b) => b.id === block.id)} />
							{/each}
						</Dialog.Description>
					</Dialog.Header>
				</Dialog.Content>
			</Dialog.Root>
		</div>
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
