<script lang="ts">
import { zodClient } from 'sveltekit-superforms/adapters';
import { superForm } from 'sveltekit-superforms';
import { createCardSchema } from '$lib/config/zod-schemas';
import * as Card from '$lib/components/ui/card';
import * as Form from '$lib/components/ui/form';
import { Input } from '$lib/components/ui/input';
import { Loader2 } from 'lucide-svelte';
import { Button } from '$lib/components/ui/button';
import DisplayErrors from '$lib/components/forms/DisplayErrors.svelte';
//TODO: вынести компонент в lib
export let data: any; //подумать super validated
export let action: string = '';

const form = superForm(data, {
	validators: zodClient(createCardSchema),
	dataType: 'json'
});

const { form: formData, enhance, submitting, errors } = form;

const addBlock = () => {
	$formData.blocks = [...$formData.blocks, { content: '' }];
};
</script>

<form method="POST" use:enhance action={action}>
	<Card.Root>
		<Card.Header class="space-y-1">
			<Card.Title class="text-2xl">Create card</Card.Title>
		</Card.Header>
		<Card.Content class="grid gap-4">
			<DisplayErrors errors={errors} />
			<Form.Field form={form} name="topicName">
				<Form.Control let:attrs>
					<Form.Label>Топик</Form.Label>
					<Input {...attrs} bind:value={$formData.topicName} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			{#each $formData.blocks as _, i}
				<Form.Field form={form} name="blocks">
					<Form.Control let:attrs>
						<Form.Label>Блок {i + 1}</Form.Label>
						<Input {...attrs} bind:value={$formData.blocks[i].content} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			{/each}
			<Button variant="secondary" on:click={addBlock}>Добавить блок</Button>
		</Card.Content>
		<Card.Footer>
			<div class="block w-full">
				<Form.Button class="w-full" disabled={$submitting}>
					{#if $submitting}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						Please wait
					{:else}
						Submit
					{/if}
				</Form.Button>
			</div>
		</Card.Footer>
	</Card.Root>
</form>
