<script lang="ts">
import * as Card from '$lib/components/ui/card';
import { resetPasswordSchema } from '$lib/config/zod-schemas';
import { superForm } from 'sveltekit-superforms';
import { zodClient } from 'sveltekit-superforms/adapters';
import type { PageData } from './$types';
import SimpleForm from '$lib/components/forms/SimpleForm.svelte';
import SimpleSubmit from '$lib/components/forms/SimpleSubmit.svelte';

export let data: PageData;
const form = superForm(data.form, {
	validators: zodClient(resetPasswordSchema)
});
const inputs = [
	{
		name: 'email',
		label: 'Email'
	}
];
</script>

<div class="mx-auto flex max-w-2xl items-center justify-center">
	<SimpleForm form={form} inputs={inputs}>
		<div slot="header">
			<Card.Title class="text-2xl">Сброс пароля</Card.Title>
			<Card.Description>Вам будет отправленно письмо с инструкциями по сбросу.</Card.Description>
		</div>
		<div slot="submit" class="block w-full">
			<SimpleSubmit form={form}>Cбросить пароль</SimpleSubmit>
		</div>
	</SimpleForm>
</div>