<script lang="ts">
	import type { StudyCardExtended } from '$lib/server/database/schema';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import GradeButton from './GradeButton.svelte';
	import type { SuperForm } from 'sveltekit-superforms';
	export let studyCard: StudyCardExtended;
	export let form: SuperForm<any>;

	let revealed = false;
	const reveal = () => (revealed = true);
</script>

<Card.Root class="w-40 p-10">
	<span>{studyCard.baseCard.topic.name} </span>
	<br />
	{#if revealed}
		{#each studyCard.baseCard.blocks as cardBlock}
			<div>{cardBlock.block.content}</div>
		{/each}
		<GradeButton {form} action={`/study/${studyCard.userDeckId}/?/good`} studyCardId={studyCard.id}
			>Помню</GradeButton>
		<GradeButton {form} action={`/study/${studyCard.userDeckId}/?/again`} studyCardId={studyCard.id}
			>Непомню</GradeButton>
	{:else}
		<Button on:click={reveal}>Открыть</Button>
	{/if}
</Card.Root>
