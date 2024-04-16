<script lang="ts">
import { zodClient } from 'sveltekit-superforms/adapters';
import type { PageData } from './$types';
import { superForm } from 'sveltekit-superforms';
import { createDeckSchema } from '$lib/config/zod-schemas';
import * as Alert from '$lib/components/ui/alert';
import * as Card from '$lib/components/ui/card';
import * as Form from '$lib/components/ui/form';
import { Input } from '$lib/components/ui/input';
import { AlertCircle } from 'lucide-svelte';
import { Textarea } from '$lib/components/ui/textarea';
import { Loader2 } from 'lucide-svelte';
import { Checkbox } from '$lib/components/ui/checkbox';

export let data: PageData;

const form = superForm(data.form, {
	validators: zodClient(createDeckSchema)
});
const { form: formData, enhance, submitting, errors } = form;
</script>

<section class="container grid items-center gap-6">
	<form method="POST" use:enhance>
		<Card.Root>
			<Card.Header class="space-y-1">
				<Card.Title class="text-2xl">Create Deck</Card.Title>
			</Card.Header>
			<Card.Content class="grid gap-4">
				{#if $errors._errors?.length}
					<Alert.Root variant="destructive">
						<AlertCircle class="h-4 w-4" />
						<Alert.Title>Error</Alert.Title>
						<Alert.Description>
							{#each $errors._errors as error}
								{error}
							{/each}
						</Alert.Description>
					</Alert.Root>
				{/if}

				<Form.Field form={form} name="name">
					<Form.Control let:attrs>
						<Form.Label>Deck Name</Form.Label>
						<Input {...attrs} bind:value={$formData.name} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field form={form} name="description">
					<Form.Control let:attrs>
						<Form.Label>Description</Form.Label>
						<Textarea {...attrs} bind:value={$formData.description} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field
					form={form}
					name="public"
					class="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
				>
					<Form.Control let:attrs>
						<Checkbox {...attrs} bind:checked={$formData.public} />
						<div class="space-y-1 leading-none">
							<Form.Label>Public deck.</Form.Label>
						</div>
						<input name={attrs.name} value={$formData.public} hidden />
					</Form.Control>
				</Form.Field>
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
</section>
