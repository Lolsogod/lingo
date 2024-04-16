<script lang="ts">
import type { PageData } from './$types';
import { Button } from '$lib/components/ui/button';
import * as Dialog from '$lib/components/ui/dialog';
import CreateCardForm from '../../cards/create/CreateCardForm.svelte';
import * as Form from '$lib/components/ui/form';
import { superForm } from 'sveltekit-superforms';
import { zodClient } from 'sveltekit-superforms/adapters';
import { startStudySchema } from '$lib/config/zod-schemas';
import { Loader2, Check } from 'lucide-svelte';
export let data: PageData;
//как будто вадидация тут не нужна
const form = superForm(data.startStudyForm, {
	validators: zodClient(startStudySchema)
});
const { form: formData, enhance, submitting, errors } = form;
</script>

<section class="container grid items-center gap-6">
	<div class="flex gap-5">
		<h1 class="flex-1 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
			Колода {data.deck.name}
		</h1>
		<!---<a href="/decks/{data.deck.id}/edit"><Button>Редактировать?</Button></a>-->
		<!---чекать есть ли она уже у юзера + както кривовато-->
		<form action="?/addToUser" method="POST" use:enhance>
			<Form.Field form={form} name="addToStudy">
			<Form.Control let:attrs>
				<input name={attrs.name} value={$formData.addToStudy} hidden />
			</Form.Control>
			</Form.Field>
			<Form.Button class="w-full" disabled={data.alredyStudying ||$submitting}>
				{#if $submitting}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					Please wait
				{:else if data.alredyStudying}
					<Check class="mr-2 h-4 w-4" />
					В изучении
				{:else}
					Добавить в изучение
				{/if}
			</Form.Button>
		</form>
	</div>
	<h2
		class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
	>
		Список карт <!---доделать-->
	</h2>
	{#each data.cards as card}
		{card.topic.name}
		<br />
	{/each}
	<!--кнопка багано появляется-->
	<Dialog.Root>
		<Dialog.Trigger>
			<Button>Добавить карту</Button>
		</Dialog.Trigger>
		<Dialog.Content>
			<CreateCardForm data={data.addCardForm} action="?/addCard" />
		</Dialog.Content>
	</Dialog.Root>
</section>
