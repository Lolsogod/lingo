<script lang="ts">
	import type { PageData } from './$types';
	import CardCounter from '$lib/components/srs/CardCounter.svelte';
	import SrsCard from '$lib/components/srs/SrsCard.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { gradeCardSchema } from '$lib/config/zod-schemas';
	import StudyDeckSettings from '../../dashboard/StudyDeckSettings.svelte';
	export let data: PageData;

	const form = superForm(data.form, {
		validators: zodClient(gradeCardSchema),
		resetForm: false
	});

	//testing... maybe remove isfinished
</script>
<StudyDeckSettings settingsForm={data.settingsForm} studyDeck={data.studyDeck}/>
<CardCounter count={data.stateCount} />
<br />
{data.todayCount}

{#if data.queue.length === 0}
	На сегодня всё...
{:else}
	{#key data.queue[0].id + data.queue[0].reps}
		<SrsCard studyCard={data.queue[0]} {form} />
		<br />
	{/key}
{/if}
