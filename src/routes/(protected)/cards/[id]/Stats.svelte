<script lang="ts">
	import type { StudyCard } from "$lib/server/database/schema";

	interface Props {
		studyCard: StudyCard;
	}

	let { studyCard }: Props = $props();
</script>
<div class="border">
	<pre>{JSON.stringify(studyCard, null, 2)}</pre>
</div>


