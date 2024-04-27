<script lang="ts">
	import type { StudyCardExp } from '$lib/server/database/schema';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import GradeButton from './GradeButton.svelte';
	import type { SuperForm } from 'sveltekit-superforms';

	export let studyCard: StudyCardExp;
	export let form: SuperForm<any>;

	let revealed = false;
	const reveal = () => (revealed = true);
</script>

<Card.Root class='flex min-h-72 w-60 flex-col items-center -z-20'>
	<Card.Header>
		<h1 class="scroll-m-20 text-4xl tracking-tight lg:text-5xl">
			{studyCard.baseCard.topic.name}
		</h1></Card.Header>
	<Card.Content class="flex-1">
		{#if revealed && studyCard.baseCard.cardBlocks}
			{#each studyCard.baseCard.cardBlocks as cardBlock}
				<h2 class="scroll-m-20 pb-2 text-3xl tracking-tight transition-colors first:mt-0">
					{cardBlock.block.content}
				</h2>
			{/each}
		{/if}
	</Card.Content>
	<Card.Footer class="flex justify-center gap-3 p-0 pb-6">
		{#if revealed}
			<GradeButton
				{form}
				action={`/study/${studyCard.studyDeckId}/?/good`}
				studyCardId={studyCard.id}>Помню</GradeButton>
			<GradeButton
				{form}
				action={`/study/${studyCard.studyDeckId}/?/again`}
				studyCardId={studyCard.id}>Непомню</GradeButton>
		{:else}
			<Button on:click={reveal} class="self-bottom">Открыть</Button>
		{/if}
	</Card.Footer>
</Card.Root>

<style>
	.test{
		transform-style: preserve-3d;
		transition: transform 5s;
	}
	.flip{
		transform: rotateY(180deg);
	}
</style>