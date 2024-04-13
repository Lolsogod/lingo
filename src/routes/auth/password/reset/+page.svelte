<script lang="ts">
import * as Form from '$lib/components/ui/form';
import * as Card from '$lib/components/ui/card';
import * as Alert from '$lib/components/ui/alert';
import { resetPasswordSchema } from '$lib/config/zod-schemas';
import { superForm } from 'sveltekit-superforms';
import { Loader2 } from 'lucide-svelte';
import { AlertCircle } from 'lucide-svelte';
import { zodClient } from 'sveltekit-superforms/adapters';
import { Input } from '$lib/components/ui/input/index.js';

export let data;
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
				{#if $errors._errors?.length}
					<Alert.Root variant="destructive">
						<AlertCircle class="h-4 w-4" />
						<Alert.Title>Reset password problem</Alert.Title>
						<Alert.Description>
							{#each $errors._errors as error}
								{error}
							{/each}
						</Alert.Description>
					</Alert.Root>
				{/if}
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
