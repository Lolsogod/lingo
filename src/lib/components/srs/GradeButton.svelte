<script lang="ts">
import type { SuperForm } from 'sveltekit-superforms';
import ActionButton from '../forms/ActionButton.svelte';

export let form: SuperForm<any>;
export let studyCardId: string;
export let action: string;
</script>

<ActionButton form={form} name="studyCardId" value={studyCardId} action={action}>
	<slot />
</ActionButton>
