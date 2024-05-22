<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { X } from 'lucide-svelte';
    import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

    let closed = false
</script>
{#if !closed}
<div out:slide={{ delay: 250, duration: 300, easing: quintOut, axis: 'y' }}>
<Card.Root class="gap-1" >
	<Card.Header class="gap-0">
		<div class="flex justify-between" style="justify-content: space-between">
			<Card.Title class="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl">Добро пожаловать, в LinGo!</Card.Title>
			<Button variant="outline" on:click={() => closed = true}><X /></Button>
		</div>
		<Card.Description>Современную систему изучения японского языка</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="flex flex-col gap-1">
			<p>
				<span class="font-bold text-2xl"
					>Ниже представлены колоды повторение которых  запланировано на сегодня.</span>
			</p>
			<p>
				Повторяя карточки в системе srs вы можете расширять свой словарный запас, что позволяет вам
				понимать больше информации на изучаемом языке. Не покидая приложения вы можете
				<a href="/books" class="font-bold underline">читать книги</a>
				и <a href="/video" class="font-bold underline">смотреть видео</a>, смотря значения
				неизвестных слов в
				<a href="/dictionary" class="font-bold underline">словаре</a>
				и добавляя их в систему srs для изучения.
			</p>
			<p>
				Так же рекомендуется 
				<a href="https://chromewebstore.google.com/detail/lingo/lingo" class="font-bold underline"
					>установить расширение для браузера</a
				>, которое позволит облегчить добавление слов со сторонних ресурсов в систему.
			</p>
			<p>
				<span class="font-bold text-xl"
					>Такой цикл обучения при должной регулярности позволит вам с легкостью освоить японский
					язык!</span>
			</p>
		</div>
	</Card.Content>
</Card.Root>
</div>
{/if}