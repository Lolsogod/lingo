<script lang="ts">
	import type { MenuPlacement, TooltipPlacement } from 'vidstack';

	import CaptionSubmenu from '../menus/CaptionSubmenu.svelte';
	import Menu from '../menus/Menu.svelte';

	interface Props {
		placement: MenuPlacement;
		tooltipPlacement: TooltipPlacement;
	}

	let { placement, tooltipPlacement }: Props = $props();
</script>

<Menu {placement} {tooltipPlacement}>
	{#snippet button()}
		<media-icon class="vds-rotate-icon" type="settings"></media-icon>
	{/snippet}

	{#snippet tooltipContent()}
		<span>Settings</span>
	{/snippet}

	{#snippet content()}
		<CaptionSubmenu />
	{/snippet}
</Menu>
