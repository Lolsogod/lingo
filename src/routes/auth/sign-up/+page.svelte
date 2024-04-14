<script lang="ts">
import * as Alert from "$lib/components/ui/alert";
import * as Card from "$lib/components/ui/card";
import { Checkbox } from "$lib/components/ui/checkbox";
import * as Form from "$lib/components/ui/form";
import { Input } from "$lib/components/ui/input/index.js";
import { signUpSchema } from "$lib/config/zod-schemas";
import { Loader2 } from "lucide-svelte";
import { AlertCircle } from "lucide-svelte";
import { superForm } from "sveltekit-superforms";
import { zodClient } from "sveltekit-superforms/adapters";
import type { PageData } from "./$types";

export let data: PageData;
const form = superForm(data.form, {
	validators: zodClient(signUpSchema),
});

const { form: formData, enhance, submitting, errors } = form;
</script>

<!---<Button on:click={() => goto('/auth/oauth/google')}>Sign up with Google</Button>-->
<div class="mx-auto flex max-w-2xl items-center justify-center">
	<form method="POST" use:enhance>
		<Card.Root>
			<Card.Header class="space-y-1">
				<Card.Title class="text-2xl">Create an account</Card.Title>
				<Card.Description
					>Already have an account? <a href="/auth/sign-in" class="underline">Sign in here.</a
					></Card.Description
				>
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
				<Form.Field form={form} name="password">
					<Form.Control let:attrs>
						<Form.Label>Password</Form.Label>
						<Input {...attrs} bind:value={$formData.password} type="password" />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field
					form={form}
					name="terms"
					class="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
				>
					<Form.Control let:attrs>
						<Checkbox {...attrs} bind:checked={$formData.terms} />
						<div class="space-y-1 leading-none">
							<Form.Label>I Accept the terms and privacy policy.</Form.Label>
							<Form.Description>
								You agree to the <a href="/terms" class="text-primaryHover underline">terms</a> and
								<a href="/privacy" class="text-primaryHover underline">privacy policy</a>.
							</Form.Description>
						</div>
						<input name={attrs.name} value={$formData.terms} hidden />
					</Form.Control>
				</Form.Field>
			</Card.Content>
			<Card.Footer>
				<Form.Button class="w-full" disabled={$submitting}>
					{#if $submitting}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						Please wait
					{:else}
						Sign Up
					{/if}
				</Form.Button>
			</Card.Footer>
		</Card.Root>
	</form>
</div>
