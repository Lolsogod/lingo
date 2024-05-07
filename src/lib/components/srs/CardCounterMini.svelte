<script lang="ts">
	import type { StudyCard } from '$lib/server/database/schema';

	export let studyCards: StudyCard[];
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
</script>

<div class="flex gap-3">
	<span class="font-bold {count.New === 0 ? 'opacity-70' : 'text-blue-600'}">{count.New}</span>
	<span class="font-bold {count.Learning === 0 ? 'opacity-70' : 'text-orange-600'}"
		>{count.Learning}</span>
	<span class="font-bold {count.Relearning === 0 ? 'opacity-70' : 'text-red-600'}"
		>{count.Relearning}</span>
	<span class="font-bold {count.Review === 0 ? 'opacity-70' : 'text-green-600'}"
		>{count.Review}</span>
</div>
