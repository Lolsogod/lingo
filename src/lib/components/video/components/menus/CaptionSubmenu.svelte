<script lang="ts">
	import MenuRadio from './MenuRadio.svelte';
	import Submenu from './Submenu.svelte';
</script>

<Submenu label="Captions">
	{#snippet icon()}
		<media-icon class="vds-menu-button-icon" type="closed-captions" ></media-icon>
	{/snippet}

	{#snippet content()}
		<media-captions-radio-group class="vds-captions-radio-group vds-radio-group" >
			<template>
				<MenuRadio />
			</template>
		</media-captions-radio-group>
	{/snippet}
</Submenu>
