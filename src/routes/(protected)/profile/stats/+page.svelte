<script lang="ts">
	import { Pie } from 'svelte-chartjs';
	import { Card, CardHeader, CardContent } from '$lib/components/ui/card';
	import type { PageData } from './$types';
	import { Bar } from 'svelte-chartjs';
	import 'cal-heatmap/cal-heatmap.css';
	import { mode } from 'mode-watcher';
	import { slide } from 'svelte/transition';
	import {
		Chart,
		Title,
		Tooltip,
		Legend,
		ArcElement,
		LineElement,
		BarElement,
		CategoryScale,
		PointElement,
		LinearScale
	} from 'chart.js';
	import { onMount } from 'svelte';
	import { declOfNum } from '$lib/_helpers/declOfNum';
	Chart.register(
		Title,
		Tooltip,
		Legend,
		ArcElement,
		LineElement,
		BarElement,
		CategoryScale,
		LinearScale,
		PointElement
	);

	export let data: PageData;

	const pieData = {
		labels: ['Новые', 'Изучаются', 'Забыты', 'Повторяются'],
		datasets: [
			{
				label: 'Кол-во',
				data: [
					data.stateCount.new,
					data.stateCount.learning,
					data.stateCount.relearning,
					data.stateCount.review
				],
				backgroundColor: ['rgb(59 130 246)', 'rgb(249 115 22)', 'rgb(239 68 68)', 'rgb(34 197 94)']
			}
		]
	};

	const labels = Object.keys(data.reviewData.new);
	const lineData = {
		labels: labels,
		datasets: [
			{
				label: 'Новые',
				data: Object.values(data.reviewData.new) as number[],
				backgroundColor: 'rgb(59 130 246)'
			},
			{
				label: 'Изучаются',
				data: Object.values(data.reviewData.learning) as number[],
				backgroundColor: 'rgb(249 115 22)'
			},
			{
				label: 'Забыты',
				data: Object.values(data.reviewData.relearning) as number[],
				backgroundColor: 'rgb(239 68 68)'
			},
			{
				label: 'Повторяются',
				data: Object.values(data.reviewData.review) as number[],
				backgroundColor: 'rgb(34 197 94)'
			}
		]
	};
	let CalHeatMap: any;
	let mapCont: Element;
	onMount(async () => {
		CalHeatMap = (await import('cal-heatmap')).default;
		let cal = new CalHeatMap();
		console.log(mapCont);
		cal.paint({
			itemSelector: mapCont,
			range: 13,
			domain: {
				type: 'month', //русифицировать лейблы?
				gutter: 8
			},
			subDomain: {
				type: 'day',
				width: 20,
				height: 20,
				radius: 4
			},
			date: {
				start: new Date(new Date().getFullYear() - 1, new Date().getMonth(), new Date().getDate())
			},
			data: {
				source: data.yearData,
				x: 'date',
				y: 'value',
				defaultValue: 0
			},
			scale: {
				opacity: {
					baseColor: 'rgb(59 130 246)',
					type: 'sqrt',
					domain: [-0.2, data.maxValue]
				}
			},
			animationDuration: 750,
			theme: $mode
		});
		cal.on('mouseover', (event: any, timestamp: string | number | Date, value: string) => {
			info = `${new Date(timestamp).toLocaleDateString()} было изученно ${value} ${declOfNum(Number(value), ['карточка', 'карточки', 'карточек'])}`;
		});
	});
	let info = '';
</script>

<section class="mx-10 h-[500px] flex-col">
	<Card class="mb-5">
		<CardHeader>
			<h2>Статистика пользователя</h2>
		</CardHeader>
		<CardContent class="overflow-auto text-2xl flex gap-20 flex-col sm:flex-row">
			<div>
				<p class="font-bold">
					Текущий уровень знания языка:
					{#each Array(5)
						.fill(0)
						.map((_, i) => i < data.currentLevel) as filled}
						<span class="stars {filled ? 'filled' : ''}">★</span>
					{/each}
				</p>
				<p class="text-xl">
					Самое длинное количество дней без перерывов: {data.longestStreak}
				</p>
				<p class="font-bold">
					Текущее количество дней без перерывов: {data.currentStreak}
				</p>
				<p class="text-xl">
					Количество изучаемых колод: {data.studyDecks.length}
				</p>
				<p class="text-xl">
					Вспомнил раз: <span class="text-green-500">{data.rememberedCount}</span>
				</p>
				<p class="text-xl">
					Забыл раз: <span class="text-red-500">{data.forgottenCount}</span>
				</p>
				<p class="font-bold">
					Всего повторений: {data.totalReviews}
				</p>
			</div>
			<div>
				<p class="text-xl">
					Количество созданных карт: {data.userCardsStats.count}
				</p>
				<p class="text-xl">
					Рейтинг созданых карт: <span
						class={data.userCardsStats.avgRating > 0 ? 'text-green-500' : 'text-red-500'}
						>{data.userCardsStats.avgRating.toFixed(2)}</span>
				</p>
				<p class="text-xl">
					Количество созданных колод: {data.userDecksStats.count}
				</p>
				<p class="text-xl">
					Рейтинг созданых колод: <span
						class={data.userDecksStats.avgRating > 0 ? 'text-green-500' : 'text-red-500'}
						>{data.userDecksStats.avgRating.toFixed(2)}</span>
				</p>
				<p class="text-xl">
					Количество отсавленных коментариев: {data.userBlocksStats.count}
				</p>
				<p class="text-xl">
					Рейтинг отсавленных коментариев: <span
						class={data.userBlocksStats.avgRating > 0 ? 'text-green-500' : 'text-red-500'}
						>{data.userBlocksStats.avgRating.toFixed(2)}</span>
				</p>
				<p class="font-bold">
					Общий рейтинг: <span
						class={Number(data.currentUserRating) > 0 ? 'text-green-500' : 'text-red-500'}
						>{data.currentUserRating}</span>
				</p>
			</div>
		</CardContent>
	</Card>
	<Card class="mb-5">
		<CardHeader>
			<h2>Активность за год</h2>
		</CardHeader>
		<CardContent class="overflow-auto">
			<div id="cal-heatmap" bind:this={mapCont}></div>
			<div class="mt-2 h-4 text-muted-foreground">{info}</div>
		</CardContent>
	</Card>

	<div class="flex max-h-[50rem] flex-1 flex-col gap-5 xl:flex-row">
		<Card class="w-full xl:w-1/4 xl:min-w-[40rem]">
			<CardHeader>
				<h2>Статус карт в колоде</h2>
			</CardHeader>
			<CardContent>
				<div>&nbsp;</div>
				<Pie data={pieData} options={{ responsive: true }} />
			</CardContent>
		</Card>
		<Card class="w-full flex-1 xl:w-1/4 ">
			<CardHeader>
				<h2>Активность за последний месяц</h2>
			</CardHeader>
			<CardContent>
				<div>&nbsp;</div>
				<Bar
					class="max-h-[40rem]"
					data={lineData}
					options={{
						responsive: true,
						scales: {
							x: {
								stacked: true
							},
							y: {
								stacked: true
							}
						}
					}} />
			</CardContent>
		</Card>
	</div>
</section>

<style scoped>
	.stars {
		color: gray;
	}
	.stars.filled {
		color: rgb(228, 194, 0);
	}
</style>
