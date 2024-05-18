<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { type SuperForm } from 'sveltekit-superforms';
	import { Loader2, Check } from 'lucide-svelte';

	export let form: SuperForm<any>;
	export let action: string = '';
	export let condition: boolean = false;
	export let conditionText: string = '';
	let _class: string = '';
	export { _class as class };
	export let hideLoading: boolean = false;
	export let variant: 'link' | 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' =
		'default';
	type ActionValue = {
		name: string;
		value?: any;
	};
	export let values: ActionValue[];

	const { enhance, form: formData, submitting } = form;
	//Костыльная вещь получилась, нужна ли суперформа для таких кнопок?, ну пока пускай будет
</script>

<form {action} method="POST" use:enhance class={_class}>
	{#each values as value}
		<Form.Field {form} name={value.name}>
			<Form.Control let:attrs>
				<input name={attrs.name} value={value.value || $formData[attrs.name]} hidden />
			</Form.Control>
		</Form.Field>
	{/each}
	<Form.Button
		{variant}
		class="w-full"
		on:click={(e) => e.stopPropagation()}
		disabled={(condition || $submitting) && !hideLoading}>
		{#if $submitting && !hideLoading}
			<Loader2 class="mr-2 h-4 w-4 animate-spin" />
		{:else if condition}
			<Check class="mr-2 h-4 w-4" />
			{conditionText}
		{:else}
			<slot />
		{/if}
	</Form.Button>
</form>
