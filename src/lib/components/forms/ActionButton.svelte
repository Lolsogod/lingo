<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { type SuperForm } from 'sveltekit-superforms';
	import { Loader2, Check } from 'lucide-svelte';

	
	type ActionValue = {
		name: string;
		value?: any;
	};
	interface Props {
		form: SuperForm<any>;
		action?: string;
		condition?: boolean;
		conditionText?: string;
		class?: string;
		hideLoading?: boolean;
		variant?: 'link' | 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost';
		values: ActionValue[];
		children?: import('svelte').Snippet;
	}

	let {
		form,
		action = '',
		condition = false,
		conditionText = '',
		class: _class = '',
		hideLoading = false,
		variant = 'default',
		values,
		children
	}: Props = $props();

	const { enhance, form: formData, submitting } = form;
	//Костыльная вещь получилась, нужна ли суперформа для таких кнопок?, ну пока пускай будет
</script>

<form {action} method="POST" use:enhance class={_class}>
	{#each values as value}
		<Form.Field {form} name={value.name}>
			<Form.Control >
			{#snippet children({ props })}
							<input name={props.name} value={value.value || $formData[props.name]} hidden />
										{/snippet}
						</Form.Control>
		</Form.Field>
	{/each}
	<Form.Button
		{variant}
		class="w-full"
		onclick={(e) => e.stopPropagation()}
		disabled={(condition || $submitting) && !hideLoading}>
		{#if $submitting && !hideLoading}
			<Loader2 class="mr-2 h-4 w-4 animate-spin" />
		{:else if condition}
			<Check class="mr-2 h-4 w-4" />
			{conditionText}
		{:else}
			{@render children?.()}
		{/if}
	</Form.Button>
</form>
