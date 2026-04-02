<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Form from '$lib/components/ui/form';
	import { signUpSchema } from '$lib/config/zod-schemas';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { PageData } from './$types';
	import SimpleForm from '$lib/components/forms/SimpleForm.svelte';
	import SimpleSubmit from '$lib/components/forms/SimpleSubmit.svelte';
	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const form = superForm(data.form, {
		validators: zodClient(signUpSchema)
	});

	const { form: formData } = form;

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

<div class="mx-auto flex max-w-2xl items-center justify-center">
	<SimpleForm {form} {inputs}>
		{#snippet header()}
				<div >
				<Card.Title class="text-2xl">Регистрация</Card.Title>
				<Card.Description
					>Уже есть акаунт? <a href="/auth/sign-in" class="underline">Войти</a></Card.Description>
			</div>
			{/snippet}
		{#snippet customFields()}
			<Form.Field
				{form}
				name="terms"
				class="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
				<Form.Control>
				{#snippet children({ props })}
					<Checkbox {...props} bind:checked={$formData.terms} />
					<div class="space-y-1 leading-none">
						<Form.Label>Я принимаю условия и политику конфиденциальности.</Form.Label>
						<Form.Description>
							Вы соглашаетесь с <a href="/terms" class="text-primaryHover underline">условиями</a> и
							<a href="/privacy" class="text-primaryHover underline">политикой конфиденциальности</a>.
						</Form.Description>
					</div>
					<input name={props.name} value={$formData.terms} hidden />
				{/snippet}
				</Form.Control>
			</Form.Field>
		{/snippet}
		{#snippet submit()}
				<div  class="block w-full">
				<SimpleSubmit {form}>Зарегестрироваться</SimpleSubmit>
			</div>
			{/snippet}
	</SimpleForm>
</div>
