import {
	deleteStudyDeck,
	getQueue,
	getStudyDeck,
	gradeStudyCard,
	setNewLimit,
	setTimer
} from '$lib/server/database/models/study';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { StudyCard } from '$lib/server/database/schema';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import {
	deleteDeckSchema,
	gradeCardSchema,
	studyDeckSettingsSchema
} from '$lib/config/zod-schemas';
import { getTodayCount } from '$lib/server/database/models/study';
import { isUUID } from '$lib/_helpers/isUIID';
import { setFlash } from 'sveltekit-flash-message/server';
import { declOfNum } from '$lib/_helpers/declOfNum';

const getTimeToDue = (dueDate: Date): string => {
	const now = new Date();
	const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const timeUntilDue = dueDate.getTime() - startOfToday.getTime();

	const days = Math.floor(timeUntilDue / (1000 * 60 * 60 * 24));
	const months = Math.floor(days / 30);
	const years = Math.floor(days / 365);

	if (days < 0) {
		return 'Дата уже прошла';
	} else if (days === 0) {
		return 'Сегодня';
	} else if (days === 1) {
		return 'Завтра';
	} else if (days < 30) {
		return `Через ${days} ${declOfNum(days, ['день', 'дня', 'дней'])}`;
	} else if (months < 12) {
		return `Через ${months} ${declOfNum(months, ['месяц', 'месяца', 'месяцев'])}`;
	} else {
		return `Через ${years} ${declOfNum(years, ['год', 'года', 'лет'])}`;
	}
};

//ограничить для очереди дублируем опять
const countCardsByState = (cards: StudyCard[]): Count => {
	const initialState: Count = {
		New: 0,
		Learning: 0,
		Review: 0,
		Relearning: 0
	};

	return cards.reduce((count, card) => {
		count[card.state]++;
		return count;
	}, initialState);
};

export const load = (async (event) => {
	const user = event.locals.user;
	const studyDeckId = event.params.id;

	const studyDeck = await getStudyDeck(studyDeckId, user?.id);

	if (!studyDeck) {
		error(404, 'Колода не найдена');
	}

	const goodForm = await superValidate(event, zod(gradeCardSchema));
	const againForm = await superValidate(event, zod(gradeCardSchema));

	const todayCount = await getTodayCount(studyDeckId);

	const queue = (await getQueue(studyDeckId, studyDeck.newCardsLimit)).sort(
		() => Math.random() - Math.random()
	);
	const stateCount = countCardsByState(queue);
	//console.log(queue);

	const settingsForm = await superValidate(event, zod(studyDeckSettingsSchema));
	settingsForm.data.limit = studyDeck.newCardsLimit;
	settingsForm.data.timer = studyDeck.timer;

	return { stateCount, goodForm, againForm, todayCount, queue, settingsForm, studyDeck };
}) satisfies PageServerLoad;

export const actions = {
	good: async (event) => {
		const goodForm = await superValidate(event, zod(gradeCardSchema));
		if (!goodForm.valid) {
			setFlash({ type: 'error', message: 'Ошибка валидации формы' }, event);
			return { goodForm };
		}
		const res = await gradeStudyCard(goodForm.data.studyCardId, 'Good');
		if (res) {
			const time = getTimeToDue(res[0].due);
			setFlash({ type: 'success', message: `Следующее повторение ${time}` }, event);
		} else {
			setFlash({ type: 'error', message: 'Не удалось оценить карточку как хорошую' }, event);
		}
		return { goodForm };
	},
	again: async (event) => {
		const againForm = await superValidate(event, zod(gradeCardSchema));
		if (!againForm.valid) {
			setFlash({ type: 'error', message: 'Ошибка валидации формы' }, event);
			return { againForm };
		}
		const res = await gradeStudyCard(againForm.data.studyCardId, 'Again');
		if (res) {
			const time = getTimeToDue(res[0].due);
			setFlash({ type: 'success', message: `Следующее повторение ${time}` }, event);
		} else {
			setFlash({ type: 'error', message: 'Не удалось оценить карточку как "снова"' }, event);
		}
		return { againForm };
	},
	settings: async (event) => {
		const studyDeckId = event.params.id;
		const form = await superValidate(event, zod(studyDeckSettingsSchema));
		if (!form.valid) {
			setFlash({ type: 'error', message: 'Ошибка валидации формы' }, event);
			return { form };
		}
		await setNewLimit(studyDeckId, form.data.limit);
		await setTimer(studyDeckId, form.data.timer);
		setFlash({ type: 'success', message: 'Новый лимит успешно установлен' }, event);
		return { form };
	},
	delete: async (event) => {
		const studyDeckId = event.params.id;
		const deletForm = await superValidate(event, zod(deleteDeckSchema));
		const userId = event.locals.user?.id;
		if (!userId || !isUUID(studyDeckId) || !deletForm.valid) {
			setFlash({ type: 'error', message: 'Ошибка валидации формы или неверный ID колоды' }, event);
			return fail(400, {});
		}

		const result = await deleteStudyDeck(studyDeckId);
		if (result) {
			setFlash({ type: 'success', message: 'Колода успешно удалена' }, event);
		} else {
			setFlash({ type: 'error', message: 'Не удалось удалить колоду' }, event);
		}

		redirect(302, '/dashboard');
	}
};
