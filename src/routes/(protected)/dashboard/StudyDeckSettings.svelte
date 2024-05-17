<script lang="ts">
	import SimpleForm from '$lib/components/forms/SimpleForm.svelte';
	import SimpleSubmit from '$lib/components/forms/SimpleSubmit.svelte';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { studyDeckSettingsSchema } from '$lib/config/zod-schemas';
	import type { StudyDeckExp } from '$lib/server/database/schema';
	import { superForm, type SuperForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let form: SuperForm<any>;
	export let studyDeck: StudyDeckExp;

	const inputs = [
		{
			name: 'limit',
			label: 'Кол-во новых в день',
			type: 'number'
		},
		{
			name: 'timer',
			label: 'Время для одной карты с.',
			type: 'number'
		}
	];
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>Настройки</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Настройки обучения для {studyDeck.deck.name}</Dialog.Title>
			<Dialog.Description>
				выставте 0 - чтобы отключить таймер
			</Dialog.Description>
		</Dialog.Header>
		<SimpleForm {form} {inputs} action={`/study/${studyDeck.id}/?/settings`}>
			<div slot="submit">
				<SimpleSubmit {form}>Сохранить</SimpleSubmit>
			</div>
		</SimpleForm>
	</Dialog.Content>
</Dialog.Root>
