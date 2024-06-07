<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { APP_NAME } from '$lib/config/constants';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="flex flex-col justify-center">
	<section class="container mx-auto p-6">
		<div class="mx-auto max-w-4xl text-center">
			<h1 class="mb-4 text-6xl font-bold">
				{APP_NAME}
			</h1>
			<div class="flex flex-col justify-start gap-1 pb-10 text-start text-xl">
				<p>
					Повторяя карточки в системе srs вы можете расширять свой словарный запас, что позволяет
					вам понимать больше информации на изучаемом языке. Не покидая приложения вы можете
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
				<p class="mt-10 text-center">
					<span class="text-xl font-bold"
						>Такой цикл обучения при должной регулярности позволит вам с легкостью освоить японский
						язык! Войдите или создайте аккаунт чтобы начать изучать язык.</span>
				</p>
			</div>
			<div class="flex justify-center gap-4">
				{#if !data.user}
					<Button href="/auth/sign-in">Войти</Button>
					<Button href="/auth/sign-up" variant="secondary">Создать аккаунт</Button>
				{/if}
			</div>
		</div>
	</section>
</div>
