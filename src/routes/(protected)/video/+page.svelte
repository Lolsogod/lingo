<script lang="ts">
    import type { PageData } from './$types';
    export let data: PageData;
</script>

<section class="w-[1000px] mx-auto">
{#await import('$lib/components/video/Player.svelte') then { default: Player }}
  <svelte:component this={Player} />
{/await}
</section>
