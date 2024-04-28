import {
	getQueue,
	getStudyDeck,
	gradeStudyCard,
	setNewLimit
} from '$lib/server/database/models/study';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { StudyCard } from '$lib/server/database/schema';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { gradeCardSchema, studyDeckSettingsSchema } from '$lib/config/zod-schemas';
import { getTodayCount } from '$lib/server/database/models/study';

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
	console.log(queue)

	const settingsForm = await superValidate(event, zod(studyDeckSettingsSchema));
	settingsForm.data.limit = studyDeck.newCardsLimit;

	return { stateCount, goodForm, againForm, todayCount, queue, settingsForm, studyDeck };
}) satisfies PageServerLoad;

export const actions = {
	good: async (event) => {
		const goodForm = await superValidate(event, zod(gradeCardSchema));
		const res = await gradeStudyCard(goodForm.data.studyCardId, 'Good');
		console.log(res);
		console.log('remembe)');
		return { goodForm };
	},
	again: async (event) => {
		const againForm = await superValidate(event, zod(gradeCardSchema));
		const res = await gradeStudyCard(againForm.data.studyCardId, 'Again');
		console.log(res);
		console.log('forget(');
		return { againForm };
	},
	settings: async (event) => {
		const studyDeckId = event.params.id;
		const form = await superValidate(event, zod(studyDeckSettingsSchema));
		await setNewLimit(studyDeckId, form.data.limit);
		return { form };
	}
};
