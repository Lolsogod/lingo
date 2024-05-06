<script lang="ts">
	import type { StudyCardExp } from '$lib/server/database/schema';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import GradeButton from './GradeButton.svelte';
	import type { SuperForm } from 'sveltekit-superforms';

	export let studyCard: StudyCardExp;
	export let goodForm: SuperForm<any>;
	export let againForm: SuperForm<any>;
	let revealed = false;
	const reveal = () => (revealed = true);
</script>

<div class={`flip-card w-60 ${revealed ? 'revealed' : ''}`}>
	<div class="inner relative">
		<div class="front absolute">
			<Card.Root class=" -z-20 flex min-h-72 w-60 flex-col items-center">
				<Card.Header>
					<h1>
						{studyCard.baseCard.topic.name}
					</h1></Card.Header>
				<Card.Content class="flex-1"></Card.Content>
				<Card.Footer class="flex justify-center gap-3 p-0 pb-6">
					<Button on:click={reveal} class="self-bottom">Открыть</Button>
				</Card.Footer>
			</Card.Root>
		</div>
		<div class="back absolute">
			<Card.Root class="back back -z-20 flex min-h-72 w-60 flex-col items-center">
				<Card.Header>
					<h1>
						{studyCard.baseCard.topic.name}
					</h1></Card.Header>
				<Card.Content class="flex-1">
					{#if studyCard.baseCard.cardBlocks}
						{#each studyCard.baseCard.cardBlocks as cardBlock}
							{#if cardBlock.block.type === 'text'}
								<h2>
									{cardBlock.block.content}
								</h2>
							{:else if cardBlock.block.type === 'image'}
								<img src={cardBlock.block.content} alt="" class="h-48 w-full object-cover" />
							{:else if cardBlock.block.type === 'audio'}
								<audio controls src={cardBlock.block.content} />
							{/if}
						{/each}
					{/if}
				</Card.Content>
				<Card.Footer class="flex justify-center gap-3 p-0 pb-6">
					<GradeButton
						form={againForm}
						action={`/study/${studyCard.studyDeckId}/?/again`}
						studyCardId={studyCard.id}>Непомню</GradeButton>
					<GradeButton
						form={goodForm}
						action={`/study/${studyCard.studyDeckId}/?/good`}
						studyCardId={studyCard.id}>Помню</GradeButton>
				</Card.Footer>
			</Card.Root>
		</div>
	</div>
</div>

<style>
	.flip-card {
		perspective: 1000px;
	}

	.inner {
		transition: transform 0.8s;
		transform-style: preserve-3d;
	}

	.flip-card.revealed .inner,
	.back {
		transform: rotateY(180deg);
	}

	.front,
	.back {
		backface-visibility: hidden;
	}
</style>
