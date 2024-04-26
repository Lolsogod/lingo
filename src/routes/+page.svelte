<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { APP_NAME } from '$lib/config/constants';
	import type { PageData } from './$types';
	
	export let data: PageData;
</script>

<div class="flex-1">
	<section class="container grid items-center gap-6">
		<div class="flex max-w-[980px] flex-col items-start gap-2">
			<h1 class="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
				{APP_NAME}
			</h1>
			<p class="max-w-[700px] text-lg text-muted-foreground">
				Мы вынуждены отталкиваться от того, что начало повседневной работы по формированию позиции
				играет важную роль в формировании поставленных обществом задач. Таким образом, существующая
				теория в значительной степени обусловливает важность своевременного выполнения сверхзадачи.
				Как принято считать, ключевые особенности структуры проекта объявлены нарушающими
				общечеловеческие нормы этики и морали. А ещё явные признаки победы институционализации
				представлены в исключительно положительном свете. Ясность нашей позиции очевидна: реализация
				намеченных плановых заданий не оставляет шанса для позиций, занимаемых участниками в
				отношении поставленных задач. Ясность нашей позиции очевидна: повышение уровня гражданского
				сознания однозначно определяет каждого участника как способного принимать собственные
				решения касаемо первоочередных требований.
			</p>
		</div>
		<div class="flex gap-4">
			{#if !data.user}
				<Button on:click={() => goto('/auth/sign-in')}>Войти</Button>
				<Button on:click={() => goto('/auth/sign-up')} variant="outline">Создать аккаунт</Button>
			{/if}
		</div>
	</section>
</div>
