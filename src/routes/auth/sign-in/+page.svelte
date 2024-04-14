<script lang="ts">
import * as Alert from "$lib/components/ui/alert";
import * as Card from "$lib/components/ui/card";
import * as Form from "$lib/components/ui/form";
import { Input } from "$lib/components/ui/input/index.js";
import { signInSchema } from "$lib/config/zod-schemas";
import { Loader2 } from "lucide-svelte";
import { AlertCircle } from "lucide-svelte";
import { superForm } from "sveltekit-superforms";
import { zodClient } from "sveltekit-superforms/adapters";
import type { PageData } from "./$types";

export let data: PageData;
const form = superForm(data.form, {
	validators: zodClient(signInSchema),
});

const { form: formData, enhance, submitting, errors } = form;
</script>

<div class="mx-auto flex max-w-2xl items-center justify-center">
	<form method="POST" use:enhance>
		<Card.Root>
			<Card.Header class="space-y-1">
				<Card.Title class="text-2xl">Sign in</Card.Title>
				<Card.Description
					>Don't have an account yet? <a href="/auth/sign-up" class="underline">Sign up here.</a
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
			</Card.Content>
			<Card.Footer>
				<div class="block w-full">
					<Form.Button class="w-full" disabled={$submitting}
						>{#if $submitting}
							<Loader2 class="mr-2 h-4 w-4 animate-spin" />
							Please wait{:else}Sign In{/if}
					</Form.Button>

					<div class="mt-6 text-center text-sm">
						<a href="/auth/password/reset" class="underline">Forgot your password?</a>
					</div>
				</div>
			</Card.Footer>
		</Card.Root>
	</form>
</div>
