import type { PageServerLoad } from './$types';
import { getStudyDeck } from '$lib/server/database/models/study';
import {
	countCardsByState,
	reviewsForTimePeriod,
	reviewsForTimePeriodMerged
} from '$lib/server/database/models/stats';
import { error } from '@sveltejs/kit';

function genLastYear(data: { [key: string]: number }) {
	const result: { [key: string]: number } = {};
	const today = new Date();
	for (let i = 365; i >= 0; i--) {
		const date = new Date(today);
		date.setDate(today.getDate() - i);
		result[date.toISOString().slice(0, 10)] = data[date.toISOString().slice(0, 10)] || 0;
	}
	return result;
}

function genLastMonth(data: { [key: string]: number }) {
	const result: { [key: string]: number } = {};
	const today = new Date();
	for (let i = 29; i >= 0; i--) {
		const date = new Date(today);
		date.setDate(today.getDate() - i);
		const dateString = date.toISOString().slice(0, 10);
		result[dateString] = data[dateString] || 0;
	}
	return result;
}

function mapDataToArray(data: { [key: string]: number }): Array<{ date: string; value: number }> {
	return Object.entries(data).map(([date, value]) => ({
		date,
		value
	}));
}

export const load = (async (event) => {
	const user = event.locals.user;
	const studyDeckId = event.params.id;

	const studyDeck = await getStudyDeck(studyDeckId, user?.id);
	if (!user) {
		error(401, 'Unauthorized');
	}
	if (!studyDeck) {
		error(404, 'Study deck not found');
	}
	const reviewsByDay = await reviewsForTimePeriod(studyDeckId);
	const mergedReviews = await reviewsForTimePeriodMerged(studyDeckId);
	const stateCount = countCardsByState(studyDeck.studyCards);
	const reviewData = {
		new: genLastMonth(reviewsByDay.New),
		learning: genLastMonth(reviewsByDay.Learning),
		review: genLastMonth(reviewsByDay.Review),
		relearning: genLastMonth(reviewsByDay.Relearning)
	};

	const yearData = mapDataToArray(genLastYear(mergedReviews));

	const maxValue = Math.max(...yearData.map((d) => d.value));

	return { stateCount, studyDeck, reviewsByDay, reviewData, yearData, maxValue };
}) satisfies PageServerLoad;
