<script lang="ts">
import Button from '$lib/components/ui/button/button.svelte';
import * as Form from '$lib/components/ui/form';
import { Card, CardContent, CardFooter } from '$lib/components/ui/card';
import type { CardWithTopic } from '$lib/server/database/schema';
import { superForm, type SuperValidated } from 'sveltekit-superforms';
import { zodClient } from 'sveltekit-superforms/adapters';
import { Check, Loader2 } from 'lucide-svelte';
import { addCardToDeckSchema } from '$lib/config/zod-schemas';
export let data: {
	form: SuperValidated<
		{
			cardId: string;
		},
		any,//я хочу умереть
		{
			cardId: string;
		}
	>;
	added: boolean;
};
export let cardInfo: CardWithTopic;
// ааааа формы упростить
const form = superForm(data.form, {
	validators: zodClient(addCardToDeckSchema)
});
const { form: formData, enhance, submitting } = form;
$formData.cardId = cardInfo.id!;
</script>

<Card class="flex h-52 w-36 cursor-pointer flex-col">
	<CardContent class="flex h-12 flex-1 items-center justify-center p-0">
		<span class="text-3xl">{cardInfo.topic.name}</span>
	</CardContent>
	<CardFooter>
		<form method="POST" use:enhance>
			<Form.Field form={form} name="cardId">
				<Form.Control let:attrs>
					<input name={attrs.name} value={$formData.cardId} hidden />
				</Form.Control>
			</Form.Field>
			<Form.Button class="w-full" disabled={data.added ||$submitting}>
				{#if $submitting}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					Please wait
				{:else if data.added}
					<Check class="mr-2 h-4 w-4" />
					В изучении
				{:else}
					Добавить
				{/if}
			</Form.Button>
		</form>
	</CardFooter>
</Card>
