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
		<media-fullscreen-button class="vds-button" >
			<media-icon class="vds-fs-enter-icon" type="fullscreen"></media-icon>
			<media-icon class="vds-fs-exit-icon" type="fullscreen-exit"></media-icon>
		</media-fullscreen-button>
	{/snippet}

	{#snippet content()}
	
			<span class="vds-fs-enter-tooltip-text">Enter Fullscreen</span>
			<span class="vds-fs-exit-tooltip-text">Exit Fullscreen</span>
		
	{/snippet}
</Tooltip>
