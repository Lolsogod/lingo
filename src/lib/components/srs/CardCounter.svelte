<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	export let count: Count;
	let className;
	export { className as class };
</script>

<div class={className}>
	<Badge variant="outline" class="bg-blue-500 bg-opacity-60">Новых - {count.New}</Badge>
	<Badge variant="outline" class="bg-orange-500 bg-opacity-60">Изучаются - {count.Learning}</Badge>
	<Badge variant="outline" class="bg-red-500 bg-opacity-60">Забыты - {count.Relearning}</Badge>
	<Badge variant="outline" class="bg-green-500 bg-opacity-60">Повторение - {count.Review}</Badge>
</div>
