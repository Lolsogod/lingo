<script lang="ts">
	import { page } from '$app/stores';
</script>

<section class="container grid items-center gap-6">
	<div class="flex max-w-[980px] flex-col items-start gap-2">
		{#if $page.status === 404}
			<h1>Страница не найдена</h1>
			<p class="max-w-[700px] text-lg text-muted-foreground">
				<a href="/" class="underline">Домой</a>
			</p>
		{:else if $page.status === 401}
			<h1>Доступ запрещен</h1>
			<p class="max-w-[700px] text-lg text-muted-foreground">
				<a href="/" class="underline">Домой</a>
			</p>
		{:else}
			<h1>Неизвестная ошибка</h1>
			<p class="max-w-[700px] text-lg text-muted-foreground">Попробуйте зайти позднее</p>
		{/if}

		{#if $page.error?.errorId}
			<p class="max-w-[700px] text-lg text-muted-foreground">Error ID: {$page.error.errorId}</p>
		{/if}
	</div>
</section>
