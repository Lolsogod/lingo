<script lang="ts">
	import type { PageData } from './$types';
	import CreateCardForm from '$lib/components/forms/card/CreateCardForm.svelte';
	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<CreateCardForm data={data.form} action="?/addCard" blocks={data.blocks} />
