<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Form from '$lib/components/ui/form';
	import { Card, CardContent, CardFooter } from '$lib/components/ui/card';
	import type { CardExp } from '$lib/server/database/schema';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Check, Loader2 } from 'lucide-svelte';
	import { addCardToDeckSchema } from '$lib/config/zod-schemas';
	import ActionButton from '$lib/components/forms/ActionButton.svelte';
	//TODO: самнительнаа....
	export let data: {
		form: SuperValidated<
			{
				cardId: string;
			},
			any,
			{
				cardId: string;
			}
		>;
	};

	export let cardInfo: CardExp;
	const form = superForm(data.form, {
		validators: zodClient(addCardToDeckSchema),
		resetForm: false
	});
	//мб не через валуе а через адрес акшена
</script>

<CardFooter>
	<ActionButton
		{form}
		values={[{ name: 'cardId', value: cardInfo.id }]}
		condition={cardInfo.isAdded}
		conditionText={'Добавлено'}
		class="w-full">+</ActionButton
	></CardFooter>
