<script lang="ts">
import { goto } from '$app/navigation';
import { Button } from '$lib/components/ui/button';
import * as Card from '$lib/components/ui/card';
import * as Form from '$lib/components/ui/form';
import { Input } from '$lib/components/ui/input';
import { editUserSchema } from '$lib/config/zod-schemas';
import { Loader2 } from 'lucide-svelte';
import { superForm } from 'sveltekit-superforms';
import { zodClient } from 'sveltekit-superforms/adapters';
import type { PageData } from './$types';
import DisplayErrors from '$lib/components/forms/DisplayErrors.svelte';

export let data: PageData;

//TODO: on submit form not changes visualy, only after reload
const form = superForm(data.form, {
	validators: zodClient(editUserSchema)
});

const { form: formData, enhance, submitting, errors } = form;
</script>

<div class="mx-auto flex max-w-2xl items-center justify-center">
	<form method="POST" use:enhance>
		<Card.Root>
			<Card.Header class="space-y-1">
				<Card.Title class="text-2xl">Profile</Card.Title>
				<Card.Description>Update your profile settings below.</Card.Description>
			</Card.Header>
			<Card.Content class="grid gap-4">
				<DisplayErrors errors={errors} />
				<Form.Field form={form} name="firstName">
					<Form.Control let:attrs>
						<Form.Label>First Name</Form.Label>
						<Input {...attrs} bind:value={$formData.firstName} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field form={form} name="lastName">
					<Form.Control let:attrs>
						<Form.Label>Last Name</Form.Label>
						<Input {...attrs} bind:value={$formData.lastName} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field form={form} name="email">
					<Form.Control let:attrs>
						<Form.Label>Email</Form.Label>
						<Input {...attrs} bind:value={$formData.email} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</Card.Content>
			<Card.Footer>
				<div class="block w-full">
					<Form.Button class="w-full" disabled={$submitting}>
						{#if $submitting}
							<Loader2 class="mr-2 h-4 w-4 animate-spin" />
							Please wait
						{:else}
							Update profile
						{/if}
					</Form.Button>
					<div class="mt-6 text-center text-sm">
						<Button on:click={() => goto('/auth/password/reset')} class="w-full" variant="outline"
							>Change your password</Button
						>
					</div>
				</div>
			</Card.Footer>
		</Card.Root>
	</form>
</div>
