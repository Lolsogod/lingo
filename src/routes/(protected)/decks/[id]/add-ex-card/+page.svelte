<script lang="ts">
//просто отвратительнешее повторение кода
import type { PageData } from './$types';
import AddCard from './AddCard.svelte';
export let data: PageData;
</script>

<section class="container grid items-center gap-6">
	<h2
		class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
	>
		Мои карты
	</h2>

	{#if data.userCreatedCards}
		<div class="grid grid-cols-3 gap-5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8">
			{#each data.userCreatedCards as card}
				<AddCard cardInfo={card} data={data} />
			{/each}
		</div>
	{:else}
		<span class="text-xl text-muted-foreground">нет карт</span>
	{/if}
	<h2
		class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
	>
		Общие карты
	</h2>
	{#if data.publicCards}
		<div class="grid grid-cols-3 gap-5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8">
			{#each data.publicCards as card}
				<AddCard cardInfo={card} data={data} />
			{/each}
		</div>
	{:else}
		<span class="text-xl text-muted-foreground">нет карт</span>
	{/if}
</section>
