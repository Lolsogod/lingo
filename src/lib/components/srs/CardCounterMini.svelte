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
	<span class="text-blue-600 font-bold">{count.New}</span>
	<span class="text-orange-600 font-bold">{count.Learning}</span>
	<span class="text-red-600 font-bold">{count.Relearning}</span>
	<span class="text-green-600 font-bold">{count.Review}</span>
</div>
