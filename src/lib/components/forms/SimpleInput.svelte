<script lang="ts">
import * as Form from '$lib/components/ui/form';
import type { SuperForm } from 'sveltekit-superforms';
import { Input } from '$lib/components/ui/input/';
export let form: SuperForm<any, any>;
export let label: string;
export let name: string;
export let type: string = '';

const { form: formData } = form;
</script>

<Form.Field form={form} name={name}>
	<Form.Control let:attrs>
		<Form.Label>{label}</Form.Label>
		<Input {...attrs} bind:value={$formData[name]} type={type} />
	</Form.Control>
	<Form.FieldErrors />
</Form.Field>
