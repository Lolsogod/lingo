<script lang="ts">
import { goto } from '$app/navigation';
import { Button } from '$lib/components/ui/button';
import * as Card from '$lib/components/ui/card';
import { editUserSchema } from '$lib/config/zod-schemas';
import { superForm } from 'sveltekit-superforms';
import { zodClient } from 'sveltekit-superforms/adapters';
import type { PageData } from './$types';
import SimpleForm from '$lib/components/forms/SimpleForm.svelte';
import SimpleSubmit from '$lib/components/forms/SimpleSubmit.svelte';

export let data: PageData;

//TODO: on submit form not changes visualy, only after reload
const form = superForm(data.form, {
	validators: zodClient(editUserSchema)
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
const { form: formData, enhance, submitting, errors } = form;
</script>

<div class="mx-auto flex max-w-2xl items-center justify-center">
	<SimpleForm form={form} inputs={inputs}>
		<div slot="header">
			<Card.Title class="text-2xl">Профиль</Card.Title>
			<Card.Description>Обновите настройки профиля ниже.</Card.Description>
		</div>
		<div slot="submit" class="block w-full">
			<SimpleSubmit form={form}>Обновить профиль</SimpleSubmit>
			<div class="mt-6 text-center text-sm">
				<Button on:click={() => goto('/auth/password/reset')} class="w-full" variant="outline"
					>Изменить пароль</Button
				>
			</div>
		</div>
	</SimpleForm>
</div>
