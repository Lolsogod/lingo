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
		<media-mute-button class="vds-button" >
			<media-icon class="vds-mute-icon" type="mute"></media-icon>
			<media-icon class="vds-volume-low-icon" type="volume-low"></media-icon>
			<media-icon class="vds-volume-high-icon" type="volume-high"></media-icon>
		</media-mute-button>
	{/snippet}

	{#snippet content()}
	
			<span class="vds-mute-tooltip-text">Unmute</span>
			<span class="vds-unmute-tooltip-text">Mute</span>
		
	{/snippet}
</Tooltip>
