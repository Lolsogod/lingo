<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { userUpdatePasswordSchema } from '$lib/config/zod-schemas';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { PageData } from './$types';
	import SimpleForm from '$lib/components/forms/SimpleForm.svelte';
	import SimpleSubmit from '$lib/components/forms/SimpleSubmit.svelte';

	export let data: PageData;
	const form = superForm(data.form, {
		validators: zodClient(userUpdatePasswordSchema)
	});
	const inputs = [
		{
			name: 'password',
			label: 'Новый пароль',
			type: 'password'
		},
		{
			name: 'confirmPassword',
			label: 'Подтвердите пароль',
			type: 'password'
		}
	];
</script>

<div class="mx-auto flex max-w-2xl items-center justify-center">
	<SimpleForm {form} {inputs}>
		<div slot="header">
			<Card.Title class="text-2xl">Измените ваш пароль</Card.Title>
			<Card.Description>Выберите новый пароль для вашей учетной записи.</Card.Description>
		</div>
		<div slot="submit" class="block w-full">
			<SimpleSubmit {form}>Обновить пароль</SimpleSubmit>
		</div>
	</SimpleForm>
</div>
