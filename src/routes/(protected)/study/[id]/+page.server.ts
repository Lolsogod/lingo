import { getQueue, getStudyDeck, gradeStudyCard, setNewLimit } from '$lib/server/database/models/study';
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
		error(404, 'Deck not found');
	}

	const stateCount = countCardsByState(studyDeck.studyCards);
	const form = await superValidate(event, zod(gradeCardSchema));
	
	const todayCount = await getTodayCount(studyDeckId);

	const queue = (await getQueue(studyDeckId, studyDeck.newCardsLimit)).sort(() => Math.random() - Math.random());

	const settingsForm = await superValidate(event, zod(studyDeckSettingsSchema));
	settingsForm.data.limit = studyDeck.newCardsLimit;

	return { stateCount, form, todayCount, queue, settingsForm, studyDeck };
}) satisfies PageServerLoad;

export const actions = {
	good: async (event) => {
		const form = await superValidate(event, zod(gradeCardSchema));
		await gradeStudyCard(form.data.studyCardId, 'Good');
		console.log('remembe)');
	},
	again: async (event) => {
		const form = await superValidate(event, zod(gradeCardSchema));
		await gradeStudyCard(form.data.studyCardId, 'Again');
		console.log('forget(');
	},
	settings: async (event) => {
		const studyDeckId = event.params.id;
		const form = await superValidate(event, zod(studyDeckSettingsSchema));
		await setNewLimit(studyDeckId, form.data.limit);
	}
};
