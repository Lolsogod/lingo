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
		<media-caption-button class="vds-button" >
			<media-icon class="vds-cc-on-icon" type="closed-captions-on"></media-icon>
			<media-icon class="vds-cc-off-icon" type="closed-captions"></media-icon>
		</media-caption-button>
	{/snippet}

	{#snippet content()}
	
			<span class="vds-cc-on-tooltip-text">Closed-Captions Off</span>
			<span class="vds-cc-off-tooltip-text">Closed-Captions On</span>
		
	{/snippet}
</Tooltip>
