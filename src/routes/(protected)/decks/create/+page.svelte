<script lang="ts">
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms';
	import { createDeckSchema } from '$lib/config/zod-schemas';
	import * as Card from '$lib/components/ui/card';
	import SimpleForm from '$lib/components/forms/SimpleForm.svelte';
	import SimpleSubmit from '$lib/components/forms/SimpleSubmit.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const form = superForm(data.form, {
		validators: zodClient(createDeckSchema)
	});

	const inputs = [
		{
			name: 'name',
			label: 'Название колоды'
		},
		{
			name: 'description',
			label: 'Описание',
			type: 'textarea'
		},
		{
			name: 'public',
			label: 'Публичная колода',
			type: 'checkbox'
		},
		{
			name: 'addToStudy',
			label: 'Добавить в изучение',
			type: 'checkbox'
		}
	];
</script>

<section class="container grid items-center gap-6">
	<SimpleForm {form} {inputs}>
		{#snippet header()}
				<div >
				<Card.Title class="text-2xl">Создать колоду</Card.Title>
			</div>
			{/snippet}
		{#snippet submit()}
				<div  class="block w-full">
				<SimpleSubmit {form}>Создать</SimpleSubmit>
			</div>
			{/snippet}
	</SimpleForm>
</section>
