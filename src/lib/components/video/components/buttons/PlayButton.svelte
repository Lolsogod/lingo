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
		<media-play-button class="vds-button" >
			<media-icon class="vds-play-icon" type="play"></media-icon>
			<media-icon class="vds-pause-icon" type="pause"></media-icon>
		</media-play-button>
	{/snippet}

	{#snippet content()}
	
			<span class="vds-play-tooltip-text">Play</span>
			<span class="vds-pause-tooltip-text">Pause</span>
		
	{/snippet}
</Tooltip>
