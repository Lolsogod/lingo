<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import type { SuperForm } from 'sveltekit-superforms';
	import { Input } from '$lib/components/ui/input/';
	import { Textarea } from '../ui/textarea';

	export let form: SuperForm<any, any>;
	export let label: string;
	export let name: string;
	export let type: string = '';

	const { form: formData } = form;
</script>

<Form.Field {form} {name}>
	<Form.Control let:attrs>
		<Form.Label>{label}</Form.Label>
		{#if type === 'textarea'}
			<Textarea {...attrs} bind:value={$formData[name]} />
		{:else}
			<Input {...attrs} bind:value={$formData[name]} {type} />
		{/if}
	</Form.Control>
	<Form.FieldErrors />
</Form.Field>
