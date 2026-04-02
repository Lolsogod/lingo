<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import type { SuperForm } from 'sveltekit-superforms';
	import { Checkbox } from '../ui/checkbox';

	interface Props {
		form: SuperForm<any, any>;
		label?: string | undefined;
		name: string;
	}

	let { form, label = undefined, name }: Props = $props();

	const { form: formData } = form;
</script>

<Form.Field {form} {name} class="flex flex-row items-start space-x-3 space-y-0 ">
	<Form.Control >
		{#snippet children({ props })}
				<Checkbox {...props} bind:checked={$formData[name]} />
			<div class="space-y-1 leading-none">
				{#if label}<Form.Label>{label}</Form.Label>{/if}
			</div>
			<input name={props.name} value={$formData[name]} hidden />
					{/snippet}
		</Form.Control>
</Form.Field>
