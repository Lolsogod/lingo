<script lang="ts">
	import type { TooltipPlacement } from 'vidstack';

	import Tooltip from '../Tooltip.svelte';

	interface Props {
		tooltipPlacement: TooltipPlacement;
	}

	let { tooltipPlacement }: Props = $props();
</script>

<Tooltip placement={tooltipPlacement}>
	{#snippet trigger()}
		<media-seek-button class="vds-button" seconds={-10} >
			<media-icon type="seek-backward-10"></media-icon>
		</media-seek-button>
	{/snippet}

	{#snippet content()}
		<span >Seek Backward</span>
	{/snippet}
</Tooltip>
