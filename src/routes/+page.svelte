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
			<p class="mb-8 text-lg">
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
			<div class="flex justify-center gap-4">
				{#if !data.user}
					<Button href="/auth/sign-in">Войти</Button>
					<Button href="/auth/sign-up" variant="secondary">Создать аккаунт</Button>
				{/if}
			</div>
		</div>
	</section>
</div>
