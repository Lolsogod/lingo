<script lang="ts">
import { zodClient } from 'sveltekit-superforms/adapters';
import type { PageData } from './$types';
import { superForm } from 'sveltekit-superforms';
import { createDeckSchema } from '$lib/config/zod-schemas';
import * as Card from '$lib/components/ui/card';
import * as Form from '$lib/components/ui/form';
import { Input } from '$lib/components/ui/input';
import { Textarea } from '$lib/components/ui/textarea';
import { Loader2 } from 'lucide-svelte';
import { Checkbox } from '$lib/components/ui/checkbox';
import DisplayErrors from '$lib/components/forms/DisplayErrors.svelte';

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
				<DisplayErrors errors={errors} />
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
				<div class="flex flex-col gap-4 rounded-md border p-4">
					<Form.Field
						form={form}
						name="public"
						class="flex flex-row items-start space-x-3 space-y-0 "
					>
						<Form.Control let:attrs>
							<Checkbox {...attrs} bind:checked={$formData.public} />
							<div class="space-y-1 leading-none">
								<Form.Label>Public deck.</Form.Label>
							</div>
							<input name={attrs.name} value={$formData.public} hidden />
						</Form.Control>
					</Form.Field>
					<Form.Field
						form={form}
						name="addToStudy"
						class="flex flex-row items-start space-x-3 space-y-0 "
					>
						<Form.Control let:attrs>
							<Checkbox {...attrs} bind:checked={$formData.addToStudy} />
							<div class="space-y-1 leading-none">
								<Form.Label>Add to study.</Form.Label>
							</div>
							<input name={attrs.name} value={$formData.addToStudy} hidden />
						</Form.Control>
					</Form.Field>
				</div>
			</Card.Content>
			<Card.Footer>
				<div class="block w-full">
					<Form.Button class="w-full" disabled={$submitting}>
						{#if $submitting}
							<Loader2 class="mr-2 h-4 w-4 animate-spin" />
							Please wait
						{:else}
							Создать
						{/if}
					</Form.Button>
				</div>
			</Card.Footer>
		</Card.Root>
	</form>
</section>
