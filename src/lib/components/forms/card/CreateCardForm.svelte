<script lang="ts">
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms';
	import { createCardSchema } from '$lib/config/zod-schemas';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import SimpleForm from '../SimpleForm.svelte';
	import SimpleSubmit from '../SimpleSubmit.svelte';

	export let data: any; //подумать super validated
	export let action: string = '';

	const form = superForm(data, {
		validators: zodClient(createCardSchema),
		dataType: 'json'
	});

	const { form: formData, enhance, submitting, errors } = form;

	const inputs = [
		{
			name: 'topicName',
			label: 'Топик'
		}
	];
	const addBlock = () => {
		$formData.blocks = [...$formData.blocks, { content: '' }];
	};
</script>

<SimpleForm {form} {inputs} {action}>
	<div slot="header">
		<Card.Title class="text-2xl">Создание карты</Card.Title>
	</div>
	<div slot="custom-fields">
		<!---нет ошибки на пустые блоки-->
		{#each $formData.blocks as _, i}
			<Form.Field {form} name="blocks">
				<Form.Control let:attrs>
					<Form.Label>Блок {i + 1}</Form.Label>
					<Input {...attrs} bind:value={$formData.blocks[i].content} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		{/each}
	</div>
	<div slot="submit" class="block w-full">
		<Form.Field {form} name="blocks">
			<Button variant="secondary" on:click={addBlock} class="block w-full">Добавить блок</Button>
			<Form.FieldErrors />
		</Form.Field>
		<SimpleSubmit {form}>Создать</SimpleSubmit>
	</div>
</SimpleForm>
