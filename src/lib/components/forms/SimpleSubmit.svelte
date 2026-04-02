<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import type { SuperForm } from 'sveltekit-superforms';
	import { Loader2 } from 'lucide-svelte';

	interface Props {
		form: SuperForm<any, any>;
		children?: import('svelte').Snippet;
	}

	let { form, children }: Props = $props();

	const { form: formData, enhance, submitting, errors } = form;
</script>

<Form.Button class="w-full" disabled={$submitting}>
	{#if $submitting}
		<Loader2 class="mr-2 h-4 w-4 animate-spin" />
		Подождите...
	{:else}
		{@render children?.()}
	{/if}
</Form.Button>
