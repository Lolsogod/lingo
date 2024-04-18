<script lang="ts">
import * as Card from '$lib/components/ui/card';
import { Checkbox } from '$lib/components/ui/checkbox';
import * as Form from '$lib/components/ui/form';
import { Input } from '$lib/components/ui/input/index.js';
import { signUpSchema } from '$lib/config/zod-schemas';
import { Loader2 } from 'lucide-svelte';
import SimpleInput from '$lib/components/forms/SimpleInput.svelte';
import { superForm } from 'sveltekit-superforms';
import { zodClient } from 'sveltekit-superforms/adapters';
import type { PageData } from './$types';
import SuperDebug from 'sveltekit-superforms';
import SimpleForm from '$lib/components/forms/SimpleForm.svelte';
import SimpleSubmit from '$lib/components/forms/SimpleSubmit.svelte';
export let data: PageData;

const form = superForm(data.form, {
	validators: zodClient(signUpSchema)
});

const { form: formData, enhance, submitting, errors } = form;

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
	},
	{
		name: 'password',
		label: 'Пароль',
		type: 'password'
	}
];
</script>

<SuperDebug data={formData} />
<div class="mx-auto flex max-w-2xl items-center justify-center">
	<SimpleForm form={form} inputs={inputs}>
		<div slot="header">
			<Card.Title class="text-2xl">Регистрация</Card.Title>
			<Card.Description
				>Уже есть акаунт? <a href="/auth/sign-in" class="underline">Войти</a></Card.Description
			>
		</div>
		<div slot="custom-fields">
			<Form.Field
				form={form}
				name="terms"
				class="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
			>
				<Form.Control let:attrs>
					<Checkbox {...attrs} bind:checked={$formData.terms} />
					<div class="space-y-1 leading-none">
						<Form.Label>Я принимаю условия и политику конфиденциальности.</Form.Label>
						<Form.Description>
							Вы соглашаетесь с <a href="/terms" class="text-primaryHover underline">условиями</a> и
							<a href="/privacy" class="text-primaryHover underline">политикой конфиденциальности</a
							>.
						</Form.Description>
					</div>
					<input name={attrs.name} value={$formData.terms} hidden />
				</Form.Control>
			</Form.Field>
		</div>
		<div slot="submit" class="block w-full">
			<SimpleSubmit form={form}>Зарегестрироваться</SimpleSubmit>
		</div>
	</SimpleForm>
</div>
