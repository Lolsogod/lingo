<script lang="ts">
	import { Languages } from 'lucide-svelte';
	interface Props {
		size: string;
	}

	let { size }: Props = $props();
</script>

<Languages {size} />
