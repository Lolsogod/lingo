<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { type SuperForm } from 'sveltekit-superforms';
	import SimpleInput from './SimpleInput.svelte';
	import DisplayErrors from './DisplayErrors.svelte';
	import SimpleCheckbox from './SimpleCheckbox.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		innerClass?: string;
		inputs?: { name: string; label?: string; type?: string }[];
		action?: string;
		form: SuperForm<any, any>;
		header?: Snippet;
		customFields?: Snippet;
		submit?: Snippet;
	}

	let {
		class: className = '',
		innerClass = '',
		inputs = [],
		action = '',
		form,
		header,
		customFields,
		submit
	}: Props = $props();

	const { enhance, errors } = form;
</script>

<form method="POST" use:enhance {action}>
	<Card.Root class={className}>
		<Card.Header class="space-y-1 {innerClass}">
			{@render header?.()}
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
			{@render customFields?.()}
		</Card.Content>
		<Card.Footer class={innerClass}>
			{@render submit?.()}
		</Card.Footer>
	</Card.Root>
</form>
