<script lang="ts">
import * as Form from '$lib/components/ui/form';
import { type SuperForm } from 'sveltekit-superforms';
import { Loader2, Check } from 'lucide-svelte';

export let form: SuperForm<any, any>;
export let action: string = '';
export let name: string = '';
export let condition: boolean = false;
export let conditionText: string = '';
let _class: string =''
export { _class as class };
export let value: any = null;
const { enhance, form: formData, submitting } = form;
//Костыльная вещь получилась, нужна ли суперформа для таких кнопок?, ну пока пускай будет
</script>

<form action={action} method="POST" use:enhance class={_class}>
	<Form.Field form={form} name={name}>
		<Form.Control let:attrs>
			<input name={attrs.name} value={value||$formData[name]} hidden />
		</Form.Control>
	</Form.Field>
	<Form.Button class="w-full" disabled={condition||$submitting}>
		{#if $submitting}
			<Loader2 class="mr-2 h-4 w-4 animate-spin" />
		{:else if condition}
			<Check class="mr-2 h-4 w-4" />
			{conditionText}
		{:else}
			<slot />
		{/if}
	</Form.Button>
</form>
