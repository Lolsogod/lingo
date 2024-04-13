<script lang="ts">
import { goto } from '$app/navigation';
import * as Form from '$lib/components/ui/form';
import * as Card from '$lib/components/ui/card';
import { Input } from '$lib/components/ui/input/index.js';
import * as Alert from '$lib/components/ui/alert';
import { signUpSchema, userSchema } from '$lib/config/zod-schemas';
import { superForm, type SuperValidated } from 'sveltekit-superforms';
import { Loader2 } from 'lucide-svelte';
import { AlertCircle } from 'lucide-svelte';
import { Button } from '$lib/components/ui/button';
import { zodClient } from 'sveltekit-superforms/adapters';
import { Checkbox } from '$lib/components/ui/checkbox';

export let data;
const form = superForm(data.form, {
	validators: zodClient(signUpSchema)
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
	<!--<Form.Root let:submitting let:errors method="POST" form={form} schema={signUpSchema} let:config>
		<Card.Root>
			<Card.Header class="space-y-1">
				<Card.Title class="text-2xl">Create an account</Card.Title>
				<Card.Description
					>Already have an account? <a href="/auth/sign-in" class="underline">Sign in here.</a
					></Card.Description
				>
			</Card.Header>
			<Card.Content class="grid gap-4">
				{#if errors?._errors?.length}
					<Alert.Root variant="destructive">
						<AlertCircle class="h-4 w-4" />
						<Alert.Title>Error</Alert.Title>
						<Alert.Description>
							{#each errors._errors as error}
								{error}
							{/each}
						</Alert.Description>
					</Alert.Root>
				{/if}
				<Form.Field config={config} name="firstName">
					<Form.Item>
						<Form.Label>First Name</Form.Label>
						<Form.Input />
						<Form.Validation />
					</Form.Item>
				</Form.Field>
				<Form.Field config={config} name="lastName">
					<Form.Item>
						<Form.Label>Last Name</Form.Label>
						<Form.Input />
						<Form.Validation />
					</Form.Item>
				</Form.Field>
				<Form.Field config={config} name="email">
					<Form.Item>
						<Form.Label>Email</Form.Label>
						<Form.Input />
						<Form.Validation />
					</Form.Item>
				</Form.Field>
				<Form.Field config={config} name="password">
					<Form.Item>
						<Form.Label>Password</Form.Label>
						<Form.Input type="password" />
						<Form.Validation />
					</Form.Item>
				</Form.Field>
				<Form.Field config={config} name="terms">
					<Form.Item class="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
						<Form.Checkbox />
						<div class="space-y-1 leading-none">
							<Form.Label>I Accept the terms and privacy policy.</Form.Label>
							<Form.Description>
								You agree to the <a href="/terms" class="text-primaryHover underline">terms</a> and
								<a href="/privacy" class="text-primaryHover underline">privacy policy</a>.
							</Form.Description>
						</div>
					</Form.Item>
				</Form.Field>
			</Card.Content>
			<Card.Footer>
				<Form.Button class="w-full" disabled={submitting}
					>{#if submitting}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						Please wait{:else}Sign Up{/if}
				</Form.Button>
			</Card.Footer>
		</Card.Root>
	</Form.Root>-->
</div>
