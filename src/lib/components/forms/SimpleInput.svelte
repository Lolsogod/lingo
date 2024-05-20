<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import type { SuperForm } from 'sveltekit-superforms';
	import { Input } from '$lib/components/ui/input/';
	import { Textarea } from '../ui/textarea';
	import { Carta, MarkdownEditor } from 'carta-md';
	import 'carta-md/default.css'; /* Default theme */
	import DOMPurify from 'isomorphic-dompurify';

	const carta = new Carta({
		sanitizer: DOMPurify.sanitize
	});


	export let form: SuperForm<any, any>;
	export let label: string | undefined = undefined;
	export let name: string;
	export let type: string = '';

	const { form: formData } = form;
</script>

<Form.Field {form} {name}>
	<Form.Control let:attrs>
		{#if label}<Form.Label>{label}</Form.Label>{/if}
		{#if type === 'textarea'}
			<Textarea {...attrs} bind:value={$formData[name]} />
		{:else if type === 'markdown'}
			<MarkdownEditor {carta} bind:value={$formData[name]} />
			<Input {...attrs} bind:value={$formData[name]} type="hidden" />
		{:else}
			<Input {...attrs} bind:value={$formData[name]} {type} />
		{/if}
	</Form.Control>
	<Form.FieldErrors />
</Form.Field>

<style lang="postcss">
</style>
