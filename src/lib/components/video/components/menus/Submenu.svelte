<script lang="ts">
	import SubmenuButton from './SubmenuButton.svelte';

	interface Props {
		label: string;
		icon?: import('svelte').Snippet;
		content?: import('svelte').Snippet;
	}

	let { label, icon, content }: Props = $props();

	const icon_render = $derived(icon);
</script>

<media-menu class="vds-menu">
	<SubmenuButton {label}>
		{#snippet icon()}
				{@render icon_render?.()}
			{/snippet}
	</SubmenuButton>
	<media-menu-items class="vds-menu-items">
		{@render content?.()}
	</media-menu-items>
</media-menu>
