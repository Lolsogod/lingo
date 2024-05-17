<script lang="ts">
	import type { PageData } from './$types';
	import CardCounter from '$lib/components/srs/CardCounter.svelte';
	import SrsCard from '$lib/components/srs/SrsCard.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { gradeCardSchema, studyDeckSettingsSchema } from '$lib/config/zod-schemas';
	import StudyDeckSettings from '../../dashboard/StudyDeckSettings.svelte';
	import { quintInOut } from 'svelte/easing';
	import StudyDeckDelete from '../../dashboard/StudyDeckDelete.svelte';
	import { Button } from '$lib/components/ui/button';
	export let data: PageData;
	let dir = 0;

	const goodForm = superForm(data.goodForm, {
		validators: zodClient(gradeCardSchema),
		id: 'good',
		resetForm: false
	});
	const againForm = superForm(data.againForm, {
		validators: zodClient(gradeCardSchema),
		id: 'again',
		resetForm: false
	});
	const settingsForm = superForm(data.settingsForm, {
		validators: zodClient(studyDeckSettingsSchema),
		resetForm: false
	});
	const flyAway = (node: HTMLDivElement, { duration }: { duration: number }) => {
		return {
			duration,
			css: (t: number) => {
				const eased = quintInOut(t);
				return `
					z-index: 100;
					transform: translateX(${dir * (1 - eased) * 150}%);
					opacity: ${eased};`;
			}
		};
	};
	let optSubmitCounter = 0;
	const { submitting: subGood, form: goodData } = goodForm;
	const { submitting: subAgain, form: againData } = againForm;
	const { submitting: subSettings } = settingsForm;

	$: $subGood === true ? optSubmitCounter++ : undefined;
	$: $subAgain === true ? optSubmitCounter++ : undefined;
	$: dir = $subGood ? 1 : $subAgain ? -1 : 0;
</script>

<section class="container grid items-center gap-6">
	<div class="flex items-center justify-end gap-2">
		<CardCounter count={data.stateCount} class="flex-1" />
		<Button href="/study/{data.studyDeck.id}/stats" variant="outline">Статистика</Button>
		<StudyDeckSettings form={settingsForm} studyDeck={data.studyDeck} />
		<StudyDeckDelete deleteForm={data.settingsForm} studyDeck={data.studyDeck} />
	</div>

	{#if data.queue.length === 0}
		На сегодня всё!
		Было изучено {data.todayCount} карт
	{:else if $subSettings}
		<span></span>
	{:else}
		<div class="flex items-center justify-center">
			<div class="relative h-[70vh] w-full overflow-hidden">
				{#key optSubmitCounter}
					<div out:flyAway={{ duration: 800 }} class="absolute left-1/2 -ml-[7.5rem]">
						<SrsCard studyCard={data.queue[0]} {goodForm} {againForm} timerLength={data.studyDeck.timer} />
					</div>
				{/key}
			</div>
		</div>
	{/if}
</section>
