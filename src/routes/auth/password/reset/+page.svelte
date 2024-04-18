<script lang="ts">
import * as Card from '$lib/components/ui/card';
import * as Form from '$lib/components/ui/form';
import { Input } from '$lib/components/ui/input/index.js';
import { resetPasswordSchema } from '$lib/config/zod-schemas';
import { Loader2 } from 'lucide-svelte';
import { superForm } from 'sveltekit-superforms';
import { zodClient } from 'sveltekit-superforms/adapters';
import type { PageData } from './$types';
import DisplayErrors from '$lib/components/forms/DisplayErrors.svelte';

export let data: PageData;
const form = superForm(data.form, {
	validators: zodClient(resetPasswordSchema)
});

const { form: formData, enhance, submitting, errors } = form;
</script>

<div class="mx-auto flex max-w-2xl items-center justify-center">
	<form method="POST" use:enhance>
		<Card.Root>
			<Card.Header class="space-y-1">
				<Card.Title class="text-2xl">Reset Your Password</Card.Title>
				<Card.Description>Receive email instructions to reset your password.</Card.Description>
			</Card.Header>
			<Card.Content class="grid gap-4">
				<DisplayErrors errors={errors} />
				<Form.Field form={form} name="email">
					<Form.Control let:attrs>
						<Form.Label>Email</Form.Label>
						<Input {...attrs} bind:value={$formData.email} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</Card.Content>
			<Card.Footer>
				<div class="w-full">
					<Form.Button class="w-full" disabled={$submitting}>
						{#if $submitting}
							<Loader2 class="mr-2 h-4 w-4 animate-spin" />
							Please wait
						{:else}
							Send Password Reset Email
						{/if}
					</Form.Button>
				</div>
			</Card.Footer>
		</Card.Root>
	</form>
</div>
