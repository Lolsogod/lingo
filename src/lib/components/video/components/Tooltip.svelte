<script lang="ts">
	import type { TooltipPlacement } from 'vidstack';

	interface Props {
		placement: TooltipPlacement;
		trigger?: import('svelte').Snippet;
		content?: import('svelte').Snippet;
	}

	let { placement, trigger, content }: Props = $props();
</script>

<media-tooltip>
	<media-tooltip-trigger>
		{@render trigger?.()}
	</media-tooltip-trigger>
	<media-tooltip-content class="vds-tooltip-content" {placement}>
		{@render content?.()}
	</media-tooltip-content>
</media-tooltip>
