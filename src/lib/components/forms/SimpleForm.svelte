<script lang="ts">
import * as Card from '$lib/components/ui/card';
import * as Form from '$lib/components/ui/form';
import { Input } from '$lib/components/ui/input/index.js';
import { signInSchema } from '$lib/config/zod-schemas';
import { Loader2 } from 'lucide-svelte';
import { superForm, type SuperForm } from 'sveltekit-superforms';
import { zodClient } from 'sveltekit-superforms/adapters';
import SimpleInput from './SimpleInput.svelte';
import DisplayErrors from './DisplayErrors.svelte';

export let inputs: { name: string; label: string; type?: string }[] = [];

export let form: SuperForm<any, any>;
const { form: formData, enhance, submitting, errors } = form;
</script>

<form method="POST" use:enhance>
	<Card.Root class="w-96">
		<Card.Header class="space-y-1">
			<slot name="header" />
		</Card.Header>
		<Card.Content class="grid gap-4">
			<DisplayErrors errors={errors} />
			{#each inputs as input}
				<SimpleInput form={form} {...input} />
			{/each}
			<slot name="custom-fields" />
		</Card.Content>
		<Card.Footer>
			<slot name="submit" />
		</Card.Footer>
	</Card.Root>
</form>
