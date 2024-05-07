<script lang="ts">
	import { Badge } from "$lib/components/ui/badge/index.js";
	export let count: Count;
	let className;
	export { className as class };
</script>

<div class={className}>
	<Badge variant="outline" class="bg-opacity-60 bg-blue-500">Новых - {count.New}</Badge>
	<Badge variant="outline" class="bg-opacity-60 bg-orange-500">Изучаются - {count.Learning}</Badge>
	<Badge variant="outline" class="bg-opacity-60 bg-red-500">Забыты - {count.Relearning}</Badge>
	<Badge variant="outline" class="bg-opacity-60 bg-green-500">Повторение - {count.Review}</Badge>
</div>
