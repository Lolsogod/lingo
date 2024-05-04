<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Form from '$lib/components/ui/form';
	import { Card, CardContent, CardFooter } from '$lib/components/ui/card';
	import type { blockExp } from '$lib/server/database/schema';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Check, Loader2 } from 'lucide-svelte';
	import { addBlockToCardSchema } from '$lib/config/zod-schemas';
	import ActionButton from '$lib/components/forms/ActionButton.svelte';
	//TODO: самнительнаа....


	export let blockInfo: blockExp;
	const form = superForm(data.form, {
		validators: zodClient(addblockToDeckSchema),
		resetForm: false
	});
	//мб не через валуе а через адрес акшена
</script>

<CardFooter>
	<ActionButton
		{form}
		values={[{ name: 'blockId', value: blockInfo.id }]}
		condition={blockInfo.isAdded}
		conditionText={'Добавлено'}
		class="w-full">+</ActionButton
	>
</CardFooter>