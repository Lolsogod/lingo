<script lang="ts">
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
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

	export let data: SuperValidated<any>; //подумать super validated
	export let action: string = '';

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

	const addBlock = () => {
		$formData.blocks = [...$formData.blocks, { content: '' }];
	};
	$formData.topicName = $page.url.searchParams.get('topic') || '';
	//find related
	$: if (browser) {
		const url = new URL($page.url);
		url.searchParams.set('topic', $formData.topicName);
		goto(url, {
			keepFocus: true
		});
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
