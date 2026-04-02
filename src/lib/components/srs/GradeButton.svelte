<script lang="ts">
	import type { SuperForm } from 'sveltekit-superforms';
	import ActionButton from '../forms/ActionButton.svelte';

	interface Props {
		form: SuperForm<any>;
		studyCardId: string;
		action: string;
		children?: import('svelte').Snippet;
	}

	let {
		form,
		studyCardId,
		action,
		children
	}: Props = $props();
</script>

<ActionButton {form} values={[{ name: 'studyCardId', value: studyCardId }]} {action} hideLoading>
	{@render children?.()}
</ActionButton>
