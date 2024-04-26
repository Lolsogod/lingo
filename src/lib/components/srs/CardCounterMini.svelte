<script lang="ts">
	import type { StudyCard } from '$lib/server/database/schema';

	export let studyCards: StudyCard[];
	export let newCount: number;

	const initialState: Count = {
		New: 0,
		Learning: 0,
		Review: 0,
		Relearning: 0
	};

	const count = studyCards.reduce((count, card) => {
		count[card.state]++;
		return count;
	}, initialState);
	$: count.New = newCount > 3 ? 0 : 3 - newCount; //TODO: replace with actual limit
</script>

<div class="flex gap-3">
	<span class="font-bold text-blue-600">{count.New}</span>
	<span class="font-bold text-orange-600">{count.Learning}</span>
	<span class="font-bold text-red-600">{count.Relearning}</span>
	<span class="font-bold text-green-600">{count.Review}</span>
</div>
