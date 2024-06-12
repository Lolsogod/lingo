<script lang="ts">
	import type { StudyCard } from "$lib/server/database/schema";

    export let studyCard: StudyCard
</script>
<div class="border">
	<pre>{JSON.stringify(studyCard, null, 2)}</pre>
</div>


