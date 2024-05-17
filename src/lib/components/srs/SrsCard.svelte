<script lang="ts">
	import type { StudyCardExp } from '$lib/server/database/schema';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import GradeButton from './GradeButton.svelte';
	import type { SuperForm } from 'sveltekit-superforms';
	import { Badge } from '$lib/components/ui/badge/index.js';

	export let studyCard: StudyCardExp;
	export let goodForm: SuperForm<any>;
	export let againForm: SuperForm<any>;
	export let timerLength: number;

	let revealed = false;
	const stateMap = {
		New: { label: 'Новая', color: 'bg-blue-500' },
		Learning: { label: 'Изучается', color: 'bg-orange-500' },
		Relearning: { label: 'Забыта', color: 'bg-red-500' },
		Review: { label: 'Повторяется', color: 'bg-green-500' }
	};

	const reveal = () => (revealed = true);

	let timer: NodeJS.Timeout;
	let remainingTime = timerLength;
	const revealAfterTimeout = () => {
		timer = setInterval(() => {
			if (remainingTime > 0) {
				remainingTime -= 1;
			} else {
				revealed = true;
				clearInterval(timer);
			}
		}, 1000);
	};
	if (timerLength > 0) {
		revealAfterTimeout();
	}
</script>

<div class={`flip-card w-80 ${revealed ? 'revealed' : ''}`}>
	<div class="inner relative">
		<div class="front absolute">
			<Card.Root class=" -z-20 flex min-h-[30rem] w-80 flex-col items-center">
				<Badge
					variant="outline"
					class="{stateMap[studyCard.state].color} absolute left-3 top-3 bg-opacity-60">
					{stateMap[studyCard.state].label}
				</Badge>
				<Card.Header>
					<h1>
						{studyCard.baseCard.topic.name}
					</h1></Card.Header>
				<Card.Content class="flex flex-1 items-center">
					{#if timerLength > 0}
						<span class="text-5xl text-muted-foreground">{remainingTime}</span>
					{/if}
				</Card.Content>
				<Card.Footer class="flex justify-center gap-3 p-0 pb-6">
					<Button on:click={reveal} class="self-bottom">Открыть</Button>
				</Card.Footer>
			</Card.Root>
		</div>
		<div class="back absolute">
			<Card.Root class="back back -z-20 flex min-h-[30rem] w-80 flex-col items-center">
				<Card.Header>
					<Badge
						variant="outline"
						class="{stateMap[studyCard.state].color} absolute left-3 top-3 bg-opacity-60">
						{stateMap[studyCard.state].label}
					</Badge>
					<h1>
						{studyCard.baseCard.topic.name}
					</h1></Card.Header>
				<Card.Content class="flex-1">
					{#if studyCard.baseCard.cardBlocks}
						{#each studyCard.baseCard.cardBlocks as cardBlock}
							{#if cardBlock.block.type === 'text'}
								<h4>
									{cardBlock.block.content}
								</h4>
							{:else if cardBlock.block.type === 'image'}
								<img src={cardBlock.block.content} alt="" class="w-full object-cover" />
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
