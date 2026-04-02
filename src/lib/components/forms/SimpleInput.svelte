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

	interface Props {
		form: SuperForm<any, any>;
		label?: string | undefined;
		name: string;
		type?: string;
	}

	let {
		form,
		label = undefined,
		name,
		type = ''
	}: Props = $props();

	const { form: formData } = form;
</script>

<Form.Field {form} {name}>
	<Form.Control >
		{#snippet children({ props })}
				{#if label}<Form.Label>{label}</Form.Label>{/if}
			{#if type === 'textarea'}
				<Textarea {...props} bind:value={$formData[name]} />
			{:else if type === 'markdown'}
				<MarkdownEditor {carta} bind:value={$formData[name]} />
				<Input {...props} bind:value={$formData[name]} type="hidden" />
			{:else}
				<Input {...props} bind:value={$formData[name]} {type} />
			{/if}
					{/snippet}
		</Form.Control>
	<Form.FieldErrors />
</Form.Field>

