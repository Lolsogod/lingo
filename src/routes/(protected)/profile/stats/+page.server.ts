import type { PageServerLoad } from './$types';
import { getAllStudyDecks, getStudyDeck } from '$lib/server/database/models/study';
import {
	countCardsByState,
	reviewsForTimePeriod,
	reviewsForTimePeriodMerged
} from '$lib/server/database/models/stats';
import { error } from '@sveltejs/kit';
import { getRecommendedDifficulty } from '$lib/server/database/models/user';
import {
	getAllBlocksSortedByRating,
	getAllCardsSortedByRating,
	getAllDecksSortedByRating,
	getAllUsersSortedByRating
} from '$lib/server/database/models/mod';
import type { StudyDeck, StudyDeckExp, StudyDeckExpPlus } from '$lib/server/database/schema';

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

function calculateStreaks(studyDecks: StudyDeckExpPlus[]) {
	const reviewDates = new Set();

	// Собираем все даты обзоров
	studyDecks.forEach((deck) => {
		deck.studyCards.forEach((card) => {
			card.reviewLogs?.forEach((log) => {
				reviewDates.add(log.createdAt.toISOString().slice(0, 10));
			});
		});
	});

	const sortedDates = Array.from(reviewDates).sort();
	let currentStreak = 0;
	let longestStreak = 0;
	let streak = 0;
	let previousDate: string | null = null;

	sortedDates.forEach(date => {
		if (previousDate) {
			const currentDate = new Date(date as string);
			const previousDateObj = new Date(previousDate as string);
			const diff = (currentDate.getTime() - previousDateObj.getTime()) / (1000 * 60 * 60 * 24);
			if (diff === 1) {
				streak++;
			} else if (diff > 1) {
				streak = 1;
			}
		} else {
			streak = 1;
		}

		if (streak > longestStreak) {
			longestStreak = streak;
		}

		const today = new Date().toISOString().slice(0, 10);
		if (date === today) {
			currentStreak = streak;
		}

		previousDate = date;
	});

	return { currentStreak, longestStreak };
}
export const load = (async (event) => {
	const user = event.locals.user;
	if (!user) {
		error(401, 'Unauthorized');
	}
	const studyDecks = await getAllStudyDecks(user?.id);

	const stateCount = { new: 0, learning: 0, review: 0, relearning: 0 };
	const reviewsByDay = { New: {}, Learning: {}, Review: {}, Relearning: {} };
	const reviewData = { new: {}, learning: {}, review: {}, relearning: {} };
	let yearData: any[] = [];
	let maxValue = 0;

	for (const studyDeck of studyDecks) {
		const deckReviewsByDay = await reviewsForTimePeriod(studyDeck.id);
		const mergedReviews = await reviewsForTimePeriodMerged(studyDeck.id);
		const deckStateCount = countCardsByState(studyDeck.studyCards);

		stateCount.new += deckStateCount.New;
		stateCount.learning += deckStateCount.Learning;
		stateCount.review += deckStateCount.Review;
		stateCount.relearning += deckStateCount.Relearning;

		for (const key of Object.keys(reviewsByDay) as (keyof typeof reviewsByDay)[]) {
			for (const date in deckReviewsByDay[key]) {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				//@ts-ignore
				reviewsByDay[key][date] = (reviewsByDay[key][date] || 0) + deckReviewsByDay[key][date];
			}
		}

		const deckReviewData = {
			new: genLastMonth(deckReviewsByDay.New),
			learning: genLastMonth(deckReviewsByDay.Learning),
			review: genLastMonth(deckReviewsByDay.Review),
			relearning: genLastMonth(deckReviewsByDay.Relearning)
		};

		for (const key of Object.keys(reviewData)) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			//@ts-ignore
			for (const date in deckReviewData[key]) {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				//@ts-ignore
				reviewData[key][date] = (reviewData[key][date] || 0) + deckReviewData[key][date];
			}
		}

		const deckYearData = mapDataToArray(genLastYear(mergedReviews));
		yearData = yearData.concat(deckYearData);

		const deckMaxValue = Math.max(...deckYearData.map((d) => d.value));
		maxValue = Math.max(maxValue, deckMaxValue);
	}

	const currentLevel = await getRecommendedDifficulty(user.id, user.initialLevel);

	const users = await getAllUsersSortedByRating();
	const currentUserRating = (users.find((u) => u.id === user.id)?.rating || 0).toFixed(2);

	const cards = await getAllCardsSortedByRating();
	const decks = await getAllDecksSortedByRating();
	const blocks = await getAllBlocksSortedByRating();

	const userCardsStats = {
		count: cards.filter((c) => c.authorId === user.id).length,
		avgRating:
			cards.filter((c) => c.authorId === user.id).reduce((sum, c) => sum + (c.rating || 0), 0) /
				cards.filter((c) => c.authorId === user.id).length || 0
	};

	const userDecksStats = {
		count: decks.filter((d) => d.authorId === user.id).length,
		avgRating:
			decks.filter((d) => d.authorId === user.id).reduce((sum, d) => sum + (d.rating || 0), 0) /
				decks.filter((d) => d.authorId === user.id).length || 0
	};

	const userBlocksStats = {
		count: blocks.filter((b) => b.authorId === user.id).length,
		avgRating:
			blocks.filter((b) => b.authorId === user.id).reduce((sum, b) => sum + (b.rating || 0), 0) /
				blocks.filter((b) => b.authorId === user.id).length || 0
	};

	const totalReviews = studyDecks.reduce((sum, deck) => sum + deck.studyCards.reduce((sum, card) => sum + card.reviewLogs.length, 0), 0);
	const rememberedCount = studyDecks.reduce((sum, deck) => 
		sum + deck.studyCards.reduce((sum, card) => 
			sum + card.reviewLogs.filter(log => log.grade === 'Good').length, 0), 0);
	
	const forgottenCount = totalReviews - rememberedCount;
	
	const { currentStreak, longestStreak } = calculateStreaks(studyDecks);

	return {
		currentStreak,
		longestStreak,
		stateCount,
		studyDecks,
		reviewsByDay,
		reviewData,
		yearData,
		maxValue,
		currentLevel,
		users,
		currentUserRating,
		userCardsStats,
		userDecksStats,
		userBlocksStats,
		totalReviews,
		rememberedCount,
		forgottenCount
	};
}) satisfies PageServerLoad;
