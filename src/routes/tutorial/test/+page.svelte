<script lang="ts">
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import type { PageData } from './$types';
	import Button from '$lib/components/ui/button/button.svelte';
	import ItemGrid from '$lib/components/items/ItemGrid.svelte';
	import DeckItem from '$lib/components/items/DeckItem.svelte';
	import ActionButton from '$lib/components/forms/ActionButton.svelte';
	import {superForm} from 'sveltekit-superforms';
	import {finishTutorialSchema} from '$lib/config/zod-schemas';
	import {zodClient} from 'sveltekit-superforms/adapters';
	export let data: PageData;

	const form = superForm(data.form, {
		validators: zodClient(finishTutorialSchema)
	});
	const levelDetails = [
		{
			title: 'Начальный уровень',
			description:
				'На данном уровне вы изучаете базовые японские слова и фразы, необходимые для повседневного общения. Вы учитесь читать и писать простые предложения на хирагане и катакане.'
		},
		{
			title: 'Элементарный уровень',
			description:
				'На этом уровне вы расширяете свой словарный запас и грамматические знания. Вы можете понимать и использовать знакомые выражения и простые фразы, направленные на удовлетворение конкретных потребностей.'
		},
		{
			title: 'Предсредний уровень',
			description:
				'На данном уровне вы начинаете понимать основные грамматические конструкции и увеличиваете свой словарный запас. Вы можете читать и понимать простые тексты, а также вести базовые разговоры на повседневные темы.'
		},
		{
			title: 'Средний уровень',
			description:
				'На этом уровне вы обладаете достаточными знаниями для понимания основных аспектов японского языка. Вы можете читать и понимать тексты средней сложности и вести разговоры на более широкий круг тем.'
		},
		{
			title: 'Продвинутый уровень',
			description:
				'На данном уровне вы обладаете глубокими знаниями грамматики и лексики. Вы можете понимать сложные тексты и вести разговоры на профессиональные и академические темы.'
		},
		{
			title: 'Высший уровень',
			description:
				'На этом уровне вы обладаете высоким уровнем владения японским языком. Вы можете свободно читать и понимать сложные тексты, а также вести разговоры на любые темы, включая специализированные и абстрактные.'
		}
	];
	const testWords = [
		{ word: 'あ', meaning: 'a', level: 0, know: false },
		{ word: 'た', meaning: 'та', level: 0, know: false },
		{ word: 'ぎ', meaning: 'ги', level: 0, know: false },
		{ word: 'や', meaning: 'я', level: 0, know: false },
		{ word: 'オ', meaning: 'о', level: 0, know: false },
		{ word: 'ヅ', meaning: 'дзу', level: 0, know: false },

		{ word: '雨', meaning: 'дождь', level: 1, know: false },
		{ word: '明日', meaning: 'завтра', level: 1, know: false },
		{ word: '大丈夫', meaning: 'хорошо', level: 1, know: false },

		{ word: '体', meaning: 'тело', level: 2, know: false },
		{ word: '普通', meaning: 'обычный', level: 2, know: false },
		{ word: '歯医者', meaning: 'стоматолог', level: 2, know: false },

		{ word: '面', meaning: 'маска/лицо', level: 3, know: false },
		{ word: '再び', meaning: 'снова', level: 3, know: false },
		{ word: '博物館', meaning: 'музей', level: 3, know: false },

		{ word: '材木', meaning: 'древесина', level: 4, know: false },
		{ word: '待合室', meaning: 'комната ожидания', level: 4, know: false },
		{ word: '自然科学', meaning: 'естественные науки', level: 4, know: false },

		{ word: '新婚', meaning: 'новый брак/молодожёны', level: 5, know: false },
		{ word: '前売り', meaning: 'предыдущая продажа', level: 5, know: false },
		{ word: '聞き取り', meaning: 'слушание', level: 5, know: false },
		{ word: '売り出し', meaning: 'продажа', level: 5, know: false }
	];

	let level: number | null = null;
	function calculateLanguageLevel() {
		const levelCounts = Array(6).fill(0);
		const totalWordsAtLevel = Array(6).fill(0);

		testWords.forEach((word) => {
			totalWordsAtLevel[word.level]++;
			if (word.know) {
				levelCounts[word.level]++;
			}
		});

		let totalKnownWords = 0;
		let totalWords = 0;

		for (let level = 0; level <= 5; level++) {
			totalWords += totalWordsAtLevel[level];
			totalKnownWords += levelCounts[level];
		}

		const totalKnownPercentage = (totalKnownWords / totalWords) * 100;

		// Определение уровня на основе процента
		if (totalKnownPercentage >= 90) return 5;
		if (totalKnownPercentage >= 75) return 4;
		if (totalKnownPercentage >= 60) return 3;
		if (totalKnownPercentage >= 45) return 2;
		if (totalKnownPercentage >= 30) return 1;
		return 0;
	}
	let revealed = Array(testWords.length).fill(false);
	function toggleReveal(index: number) {
		revealed[index] = !revealed[index];
	}
</script>

<section class="container grid gap-6">
	<h1>Тест на уровень знания языка</h1>
	{#if level === null}
		<div>
			<h2>Отметьте иероглифы/слова, которые вы знаете</h2>
			<span class="text-sm text-muted-foreground"
				>Отвечайте честно, используя функцию просмотра значений только для самопроверки</span>
		</div>
		<div class="test-grid">
			{#each testWords as word, index}
				<div class="flex items-center space-x-2">
					<Checkbox id={word.word} bind:checked={word.know} aria-labelledby={word.word} />
					<Label
						for={word.word}
						class="text-2xl font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
						{word.word}
					</Label>
					<div>
						{#if revealed[index]}
							{word.meaning}
						{:else}
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<!-- svelte-ignore a11y-no-static-element-interactions -->
							<span
								class="cursor-pointer text-xs text-muted-foreground"
								on:click={() => toggleReveal(index)}>Показать значение</span>
						{/if}
					</div>
				</div>
			{/each}
		</div>
		<Button on:click={() => (level = calculateLanguageLevel())}>Завершить</Button>
	{:else}
		<h2>Ваш текущий уровень приблизительно равен {level} - {levelDetails[level].title}</h2>
		<p>{levelDetails[level].description}</p>
		<h4>Рекуомендуется начать со следующих колод:</h4>
		{#if data.publicDecks}
			<ItemGrid>
                {#each data.publicDecks.filter((deck) => deck.level != null && deck.level >= 0 && level != null && deck.level <= level) as deck, i}
					<DeckItem deckInfo={deck} noRedirect/>
				{/each}
			</ItemGrid>
		{:else}
			<span class="text-xl text-muted-foreground">нет колод</span>
		{/if}
		<ActionButton
			{form}
			action="?/finishTutorial"
			values={[{ name: 'rating', value: level }]}>
			Перейти к обучению
		</ActionButton>
	{/if}
</section>

<style scoped>
	.test-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
		grid-gap: 1rem;
	}
</style>
