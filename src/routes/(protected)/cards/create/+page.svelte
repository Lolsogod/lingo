<script lang="ts">
import type { PageData } from './$types';
import CreateCardForm from './CreateCardForm.svelte';

export let data: PageData;
</script>

<section class="container grid items-center gap-6">
	<CreateCardForm data={data.form} />
</section>
