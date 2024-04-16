<script lang="ts">
import type { PageData } from './$types';
import { Button } from '$lib/components/ui/button';
import * as Dialog from '$lib/components/ui/dialog';
import CreateCardForm from '../../cards/create/CreateCardForm.svelte';
import { enhance } from '$app/forms';
import Input from '$lib/components/ui/input/input.svelte';
export let data: PageData;
</script>

<section class="container grid items-center gap-6">
	<div class="flex gap-5">
		<h1 class="flex-1 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
			Колода {data.deck.name}
		</h1>
		<a href="/decks/{data.deck.id}/edit"><Button>Редактировать?</Button></a>
		<!---чекать есть ли она уже у юзера + ради пендинга можно суперформу всё же и визульно лучше будет..-->
		<form action="?/addToUser" method="POST" use:enhance>
			<Input type="submit" value="Начать изучать" />
		</form>
	</div>
	<h2
		class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
	>
		Список карт <!---доделать-->
	</h2>
	{#each data.cards as card}
		{card.topic.name}
		<br />
	{/each}
	<!--кнопка багано появляется-->
	<Dialog.Root>
		<Dialog.Trigger>
			<Button>Добавить карту</Button>
		</Dialog.Trigger>
		<Dialog.Content>
			<CreateCardForm data={data} action="?/addCard" />
		</Dialog.Content>
	</Dialog.Root>
</section>
