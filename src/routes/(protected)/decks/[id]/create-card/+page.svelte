<script lang="ts">
    import type { PageData } from './$types';
    //плохой импорт
    import CreateCardForm from '../../../cards/create/CreateCardForm.svelte';
    export let data: PageData;
</script>

<CreateCardForm data={data.form} action="?/addCard" />