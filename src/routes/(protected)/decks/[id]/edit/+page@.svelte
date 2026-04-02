<script lang="ts">
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms';
	import { editDeckSchema } from '$lib/config/zod-schemas';
	import * as Card from '$lib/components/ui/card';
	import SimpleForm from '$lib/components/forms/SimpleForm.svelte';
	import SimpleSubmit from '$lib/components/forms/SimpleSubmit.svelte';
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/stores';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	const deck_url = `/decks/${$page.params.id}`;
	const form = superForm(data.form, {
		validators: zodClient(editDeckSchema),

		resetForm: false
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
		}
	];
</script>

<section class="container grid items-center gap-6">
	<Button href={`${deck_url}/`} variant="secondary">Назад</Button>
	<SimpleForm {form} {inputs}>
		{#snippet header()}
				<div >
				<Card.Title class="text-2xl">Редактировать колоду</Card.Title>
			</div>
			{/snippet}
		{#snippet submit()}
				<div  class="block w-full">
				<SimpleSubmit {form}>Сохранить</SimpleSubmit>
			</div>
			{/snippet}
	</SimpleForm>
</section>
