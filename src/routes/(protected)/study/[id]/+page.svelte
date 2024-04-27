<script lang="ts">
	import type { PageData } from './$types';
	import CardCounter from '$lib/components/srs/CardCounter.svelte';
	import SrsCard from '$lib/components/srs/SrsCard.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { gradeCardSchema } from '$lib/config/zod-schemas';
	import StudyDeckSettings from '../../dashboard/StudyDeckSettings.svelte';
	import { quintIn  } from 'svelte/easing';
	export let data: PageData;

	const form = superForm(data.form, {
		validators: zodClient(gradeCardSchema),
		resetForm: false
	});
	function spin(node: HTMLDivElement, { duration }: { duration: number; }) {
		return {
			duration,
			css: (t) => {
				const eased = quintIn(t);
				console.log(eased);
				return `
					z-index: 100;
					transform: translateX(${(1-eased)*150}%);
					opacity: ${eased};`
			}
		};
	}
</script>

<section class="container grid items-center gap-6">
	<StudyDeckSettings settingsForm={data.settingsForm} studyDeck={data.studyDeck} />
	<CardCounter count={data.stateCount} />
	{data.todayCount}

	{#if data.queue.length === 0}
		На сегодня всё...
	{:else}
		<div class="flex items-center justify-center">
			<div class="relative w-full h-80 overflow-hidden">
				{#key data.queue[0].id + data.queue[0].reps}
					<div  out:spin={{duration: 500}} class="absolute -ml-[7.5rem] left-1/2">
						<SrsCard studyCard={data.queue[0]} {form} />
					</div>
				{/key}
			</div>
		</div>
	{/if}
</section>