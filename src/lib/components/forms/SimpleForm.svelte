<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { type SuperForm } from 'sveltekit-superforms';
	import SimpleInput from './SimpleInput.svelte';
	import DisplayErrors from './DisplayErrors.svelte';
	import SimpleCheckbox from './SimpleCheckbox.svelte';

	let className = '';
	export let innerClass = '';
	export { className as class };
	export let inputs: { name: string; label?: string; type?: string }[] = [];
	export let action: string = '';
	export let form: SuperForm<any, any>;

	const { enhance, errors } = form;
	//todo: вернуть как нибудь прикольную рамку у чекбоксов
</script>

<form method="POST" use:enhance {action}>
	<Card.Root class={className}>
		<Card.Header class="space-y-1 {innerClass}">
			<slot name="header" />
		</Card.Header>
		<Card.Content class="grid gap-4 {innerClass}">
			<DisplayErrors {errors} />
			{#each inputs as input}
				{#if input.type === 'checkbox'}
					<SimpleCheckbox {form} {...input} />
				{:else}
					<SimpleInput {form} {...input} />
				{/if}
			{/each}
			<slot name="custom-fields" />
		</Card.Content>
		<Card.Footer class={innerClass}>
			<slot name="submit" />
		</Card.Footer>
	</Card.Root>
</form>
