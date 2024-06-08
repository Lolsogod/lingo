<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { editUserSchema } from '$lib/config/zod-schemas';
	import { superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { PageData } from './$types';
	import SimpleForm from '$lib/components/forms/SimpleForm.svelte';
	import SimpleSubmit from '$lib/components/forms/SimpleSubmit.svelte';

	export let data: PageData;

	const form = superForm(data.form, {
		validators: zodClient(editUserSchema),
		resetForm: false
	});

	const inputs = [
		{
			name: 'firstName',
			label: 'Имя'
		},
		{
			name: 'lastName',
			label: 'Фамилия'
		},
		{
			name: 'email',
			label: 'Email'
		}
	];
</script>

<div class="mx-auto flex max-w-2xl items-center justify-center">
	<SimpleForm {form} {inputs}>
		<div slot="header">
			<Card.Title class="text-2xl">Профиль</Card.Title>
			<Card.Description>Обновите настройки профиля ниже.</Card.Description>
		</div>
		<div slot="submit" class="block w-full">
			<SimpleSubmit {form}>Обновить профиль</SimpleSubmit>
			<div class="mt-6 text-center text-sm">
				<Button on:click={() => goto('/auth/password/reset')} class="w-full" variant="outline"
					>Изменить пароль</Button>
			</div>
		</div>
	</SimpleForm>
	<div class="mt-6 text-center text-sm">
		<p>Рекомендуемый уровень сложности: {data.recommendedDifficulty}</p>
	</div>
</div>
