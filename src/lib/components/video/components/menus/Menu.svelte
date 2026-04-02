<script lang="ts">
	import type { MenuPlacement, TooltipPlacement } from 'vidstack';
	import type { Snippet } from 'svelte';
	import Tooltip from '../Tooltip.svelte';

	interface Props {
		placement: MenuPlacement;
		tooltipPlacement: TooltipPlacement;
		button?: Snippet;
		tooltipContent?: Snippet;
		content?: Snippet;
	}

	let { placement, tooltipPlacement, button, tooltipContent, content }: Props = $props();
</script>

<media-menu class="vds-menu">
	<!-- Menu Button -->
	<Tooltip placement={tooltipPlacement}>
		{#snippet trigger()}
			<media-menu-button class="vds-menu-button vds-button">
				{@render button?.()}
			</media-menu-button>
		{/snippet}
		{#snippet content()}
			{@render tooltipContent?.()}
		{/snippet}
	</Tooltip>
	<!-- Menu Items -->
	<media-menu-items class="vds-menu-items" {placement}>
		{@render content?.()}
	</media-menu-items>
</media-menu>
