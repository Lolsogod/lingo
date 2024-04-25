import { getQueue, getStudyDeck, gradeStudyCard } from '$lib/server/database/models/study';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { StudyCard } from '$lib/server/database/schema';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { gradeCardSchema } from '$lib/config/zod-schemas';
import { getTodayCount } from '$lib/server/database/models/study';

//ограничить для очереди
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

//test queue
/*
const now = new Date();
const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 4, 0, 0, 0); //for calculating how many we learned today
*/

export const load = (async (event) => {
	//const user = event.locals.user;
	const studyDeckId = event.params.id;

	const studyDeck = await getStudyDeck(studyDeckId);
	if (!studyDeck) {
		error(404, 'Deck not found');
	}

	const stateCount = countCardsByState(studyDeck.studyCards);
	const form = await superValidate(event, zod(gradeCardSchema));
	const todayCount = await getTodayCount(studyDeckId);
	const queue = (await getQueue(studyDeckId, 3)).sort(() => Math.random() - Math.random());

	return { stateCount, form, todayCount, queue };
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
	}
};
