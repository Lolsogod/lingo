<script lang="ts">
	interface Props {
		label: string;
		icon?: import('svelte').Snippet;
	}

	let { label, icon }: Props = $props();
</script>

<media-menu-button class="vds-menu-button">
	<media-icon class="vds-menu-button-close-icon" type="chevron-left"></media-icon>
	{@render icon?.()}
	<span class="vds-menu-button-label">{label}</span>
	<span class="vds-menu-button-hint" data-part="hint"></span>
	<media-icon class="vds-menu-button-open-icon" type="chevron-right"></media-icon>
</media-menu-button>
