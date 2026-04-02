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
		<media-pip-button class="vds-button" >
			<media-icon class="vds-pip-enter-icon" type="picture-in-picture"></media-icon>
			<media-icon class="vds-pip-exit-icon" type="picture-in-picture-exit"></media-icon>
		</media-pip-button>
	{/snippet}

	{#snippet content()}
	
			<span class="vds-pip-enter-tooltip-text">Enter PIP</span>
			<span class="vds-pip-exit-tooltip-text">Exit PIP</span>
		
	{/snippet}
</Tooltip>
