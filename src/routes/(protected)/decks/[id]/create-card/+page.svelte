<script lang="ts">
	import type { PageData } from './$types';
	import CreateCardForm from '$lib/components/forms/card/CreateCardForm.svelte';
	export let data: PageData;
</script>

<CreateCardForm data={data.form} action="?/addCard" />
