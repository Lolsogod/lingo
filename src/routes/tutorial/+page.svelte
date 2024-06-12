<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import type { PageData } from './$types';
	import ActionButton from '$lib/components/forms/ActionButton.svelte';
    import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { skipSchema } from '$lib/config/zod-schemas';

	export let data: PageData;
    const form = superForm(data.skipForm, {
		validators: zodClient(skipSchema)
	});
</script>

<section class="container grid gap-6">
	<div class="flex flex-col gap-6">
		<h1 class="text-2xl font-bold">Добро пожаловать в LinGo!</h1>
		<p>
			Перед началом обучения рекомендуется пройти небольшой тест для определения начального уровня
			знаний языка.
		</p>
		<p>
			На основе результатов теста мы сможем подобрать для вас подходящие колоды для начала обучения.
		</p>
		<p>
			Позже уровень знаний можно использовать при подборе новых карт и колод, в процессе обучения
			рекомендованый уровень будет менятся в соответсвии с показаными в процессе обучения результатами.
		</p>
		<div class="flex gap-2">
			<Button href="/tutorial/test">Начать тест</Button>
			<ActionButton {form} action="?/skip" variant="outline" values={[]}>Пропустить тест</ActionButton>
		</div>
	</div>
</section>
