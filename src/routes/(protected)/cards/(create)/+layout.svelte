<script lang="ts">
	import type { LayoutData } from './$types';
	import CreateCardForm from '$lib/components/forms/card/CreateCardForm.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	export let data: LayoutData;
</script>

<section class="container grid items-center gap-6">
	<Button href="/cards/browse" class="w-14" variant="secondary">Назад</Button>
	<CreateCardForm data={data.form} decks={data.decks}/>
	<slot />
</section>
