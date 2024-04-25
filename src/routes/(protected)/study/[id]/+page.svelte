<script lang="ts">
import type { PageData } from './$types';
import CardCounter from '$lib/components/srs/CardCounter.svelte';
import SrsCard from '$lib/components/srs/SrsCard.svelte';
import { superForm } from 'sveltekit-superforms';
import { zodClient } from 'sveltekit-superforms/adapters';
import { gradeCardSchema } from '$lib/config/zod-schemas';
export let data: PageData;

const form = superForm(data.form, {
	validators: zodClient(gradeCardSchema),
	resetForm: false
});
</script>

<CardCounter count={data.stateCount} />
<br />
{#each data.studyDeck.studyCards as studyCard}
	<SrsCard studyCard={studyCard} form={form} />
	<br />
{/each}
