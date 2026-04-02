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
	import { onMount } from 'svelte';

	interface Props {
		data: SuperValidated<CreateCardSchema>;
		action?: string;
		decks?: Deck[] | null;
		blocks: any;
	}

	let {
		data,
		action = '',
		decks = null,
		blocks
	}: Props = $props();

	let preTags = '';
	const form = superForm(data, {
		validators: zodClient(createCardSchema),
		dataType: 'json'
	});

	const { form: formData } = form;
	const inputs = [{ name: 'topicName', label: 'Топик' }];

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

	let manualLevel = $state(false);

	const getLevel = async (word: string) => {
		const res = await fetch(`/level?word=${word}`);
		const parsed = await res.json();
		preTags = parsed.tags;
		manualLevel = parsed.level === '';
		return parsed.level;
	};

	onMount(async () => {
		const level = await getLevel($formData.topicName);
		$formData.level = level;
	});

	$effect(() => {
		(async () => {
			if (browser && $formData.topicName !== $page.url.searchParams.get('topic')) {
				const url = new URL($page.url);
				url.searchParams.set('topic', $formData.topicName);
				const level = await getLevel($formData.topicName);
				$formData.level = level;
				goto(url, { keepFocus: true, noScroll: true });
			}
		})();
	});

	let chosenDeckValue = $state('');
	$effect(() => {
		if (!$formData.addToStudy && $formData.studyDeckId) {
			chosenDeckValue = '';
			$formData.studyDeckId = undefined;
		}
	});

	const autoTag = async () => {
		$formData.tags = preTags;
	};
</script>

<SimpleForm {form} {inputs} {action}>
	{#snippet header()}
		<div>
			<Card.Title class="text-2xl">Создание карты</Card.Title>
		</div>
	{/snippet}
	{#snippet customFields()}
		<Form.Field {form} name="tags" class="mb-5">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Теги (через запятую)</Form.Label>
					<div class="flex gap-2">
						<Input {...props} bind:value={$formData.tags} />
						<Button onclick={autoTag} variant="outline">Aвто</Button>
					</div>
				{/snippet}
			</Form.Control>
		</Form.Field>
		<Form.Field {form} name="level" class="mb-5">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Сложность карты (определяется автоматически)</Form.Label>
					<Input {...props} bind:value={$formData.level} disabled={!manualLevel} />
				{/snippet}
			</Form.Control>
		</Form.Field>
		{#each $formData.blocks as block, i}
			<div class="flex w-full items-end gap-2">
				<Form.Field {form} name="blocks" class="flex-1">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Блок {i + 1}</Form.Label>
							<Input {...props} bind:value={block.content} disabled={!block.isNew} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="studyDeckId" class="w-1/3">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Тип блока</Form.Label>
							<Select.Root
								type="single"
								bind:value={block.type}
								onValueChange={(v: string) => {
									if (v && block.isNew) block.type = v;
								}}>
								<Select.Trigger {...props} disabled={!block.isNew}>
									{block.type || 'тип'}
								</Select.Trigger>
								<Select.Content>
									<Select.Group>
										{#each BLOCK_TYPES as type}
											<Select.Item value={type}>{type}</Select.Item>
										{/each}
									</Select.Group>
								</Select.Content>
							</Select.Root>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Button variant="destructive" class="mb-2" onclick={() => removeBlock(i)}>X</Button>
			</div>
		{/each}
		<div class="flex gap-2">
			<Form.Field {form} name="blocks" class="flex-1">
				<Button variant="secondary" onclick={addBlock} class="block w-full">Создать блок</Button>
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
						<Dialog.Description class="flex h-[500px] flex-col gap-2 overflow-y-auto">
							{#each blocks as block}
								<BlockItem
									blockInfo={block}
									onclick={() => addExisting(block)}
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
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Выберите колоду</Form.Label>
							<Select.Root
								type="single"
								bind:value={chosenDeckValue}
								onValueChange={(v: string) => {
									$formData.studyDeckId = v;
								}}>
								<Select.Trigger {...props}>
									{chosenDeckValue
										? decks?.find((d) => d.id === chosenDeckValue)?.name
										: 'Колода'}
								</Select.Trigger>
								<Select.Content>
									<Select.Group>
										{#each decks as deck}
											<Select.Item value={deck.id}>{deck.name}</Select.Item>
										{/each}
									</Select.Group>
								</Select.Content>
							</Select.Root>
							<input hidden bind:value={$formData.studyDeckId} name={props.name} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			{/if}
		{/if}
	{/snippet}
	{#snippet submit()}
		<div class="block w-full">
			<SimpleSubmit {form}>Создать</SimpleSubmit>
		</div>
	{/snippet}
</SimpleForm>
