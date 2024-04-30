<script lang="ts">
	import ActionButton from "$lib/components/forms/ActionButton.svelte";
	import * as AlertDialog from "$lib/components/ui/alert-dialog"
	import { Button } from "$lib/components/ui/button"
	import { deleteDeckSchema } from '$lib/config/zod-schemas';
	import type { StudyDeckExp } from '$lib/server/database/schema';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let deleteForm: SuperValidated<any>;
	export let studyDeck: StudyDeckExp;

	const study_deck_url = `/study/${studyDeck.id}`;
	const form = superForm(deleteForm, {
		validators: zodClient(deleteDeckSchema),
	});
</script>

<AlertDialog.Root>
	<AlertDialog.Trigger asChild let:builder>
		<Button builders={[builder]} variant="destructive">Удалить</Button>
	</AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Удалить колоду из изучения?</AlertDialog.Title>
			<AlertDialog.Description>
				Это действие нельзя отменить. Оно удалит весь прогресс по колоде и статистику изучения.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Отмена</AlertDialog.Cancel>
			<ActionButton {form} action={`${study_deck_url}?/delete`} values={[]}>
				Удалить
			</ActionButton>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
