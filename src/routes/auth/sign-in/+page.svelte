<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input/index.js';
	import { signInSchema } from '$lib/config/zod-schemas';
	import { Loader2 } from 'lucide-svelte';
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
		validators: zodClient(signInSchema)
	});
	const inputs = [
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
				<Card.Title class="text-2xl">Войти</Card.Title>
				<Card.Description
					>Нет аккаунта? <a href="/auth/sign-up" class="underline">Создать.</a></Card.Description>
			</div>
			{/snippet}
		{#snippet submit()}
				<div  class="block w-full">
				<SimpleSubmit {form}>Войти</SimpleSubmit>
				<div class="mt-6 text-center text-sm">
					<a href="/auth/password/reset" class="underline">Забыли пароль?</a>
				</div>
			</div>
			{/snippet}
	</SimpleForm>
</div>
