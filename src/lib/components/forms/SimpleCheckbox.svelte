<script lang="ts">
import * as Form from '$lib/components/ui/form';
import type { SuperForm } from 'sveltekit-superforms';
import { Checkbox } from '../ui/checkbox';

export let form: SuperForm<any, any>;
export let label: string;
export let name: string;
export let type: string = '';

const { form: formData } = form;
</script>

<Form.Field form={form} name={name} class="flex flex-row items-start space-x-3 space-y-0 ">
	<Form.Control let:attrs>
		<Checkbox {...attrs} bind:checked={$formData[name]} />
		<div class="space-y-1 leading-none">
			<Form.Label>{label}</Form.Label>
		</div>
		<input name={attrs.name} value={$formData[name]} hidden />
	</Form.Control>
</Form.Field>
