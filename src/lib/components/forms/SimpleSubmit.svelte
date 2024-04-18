<script lang="ts">
import * as Form from '$lib/components/ui/form';
import type { SuperForm } from 'sveltekit-superforms';
import { Loader2 } from 'lucide-svelte';
export let form: SuperForm<any, any>;
const { form: formData, enhance, submitting, errors } = form;
</script>

<Form.Button class="w-full" disabled={$submitting}>
	{#if $submitting}
		<Loader2 class="mr-2 h-4 w-4 animate-spin" />
		Подождите...
	{:else}
		<slot />
	{/if}
</Form.Button>
