<script lang="ts">
import * as Alert from '$lib/components/ui/alert';
import { AlertCircle } from 'lucide-svelte';
import type { SuperForm } from 'sveltekit-superforms';

export let errors: SuperForm<any>['errors'];
</script>

{#if $errors._errors?.length}
	<Alert.Root variant="destructive">
		<AlertCircle class="h-4 w-4" />
		<Alert.Title>Ошибка</Alert.Title>
		<Alert.Description>
			{#each $errors._errors as error}
				{error}
			{/each}
		</Alert.Description>
	</Alert.Root>
{/if}
