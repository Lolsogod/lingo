import db from '$lib/server/database/drizzle';
import { eq, and, count, avg, sum, sql } from 'drizzle-orm';
import { cardTable, topicTable, reviewLogTable, studyCardTable } from '../schema';

// Custom SQL function for date truncation
const dateTrunc = (period: 'day' | 'week' | 'month', column: any) =>
	sql`DATE_TRUNC(${period}, ${column})`;

import type { StudyCard } from '../schema';

export const countCardsByState = (cards: StudyCard[]): Count => {
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

function countReviewsByDate(
	reviews: { reviewDate: Date | null; state: 'New' | 'Learning' | 'Review' | 'Relearning' | null }[]
) {
	const counts = {
		New: {} as { [date: string]: number },
		Learning: {} as { [date: string]: number },
		Review: {} as { [date: string]: number },
		Relearning: {} as { [date: string]: number }
	};

	reviews.forEach((review) => {
		if (review.reviewDate && review.state) {
			const date = review.reviewDate.toISOString().slice(0, 10); // Extract YYYY-MM-DD
			if (!counts[review.state][date]) {
				counts[review.state][date] = 0;
			}
			counts[review.state][date]++;
		}
	});

	return counts;
}

export const reviewsForTimePeriod = async (studyDeckId: string) => {
	const result = await db
		.select({
			state: reviewLogTable.state,
			reviewDate: reviewLogTable.review
		})
		.from(reviewLogTable)
		.fullJoin(studyCardTable, eq(reviewLogTable.cardId, studyCardTable.id))
		.where(eq(studyCardTable.studyDeckId, studyDeckId));

	const counts = countReviewsByDate(result);

	return counts;
};
export const reviewsForTimePeriodMerged = async (studyDeckId: string) => {
	const result = await db
		.select({
			reviewDate: reviewLogTable.review
		})
		.from(reviewLogTable)
		.fullJoin(studyCardTable, eq(reviewLogTable.cardId, studyCardTable.id))
		.where(eq(studyCardTable.studyDeckId, studyDeckId));

	const counts = {} as { [date: string]: number };

	result.forEach((review) => {
		if (review.reviewDate) {
			const date = review.reviewDate.toISOString().slice(0, 10); // Extract YYYY-MM-DD
			if (!counts[date]) {
				counts[date] = 0;
			}
			counts[date]++;
		}
	});

	return counts;
};
//shit but less shit
// Get review performance (average grade per day)
/*export const getReviewPerformance = async (userId: string) => {
    const result = await db.select({
        date: dateTrunc('day', reviewLogTable.review),
        avgGrade: avg(reviewLogTable.grade)
    })
    .from(reviewLogTable)
    .innerJoin(studyCardTable, eq(reviewLogTable.cardId, studyCardTable.id))
    .innerJoin(cardTable, eq(studyCardTable.baseCardId, cardTable.id))
    .where(eq(cardTable.authorId, userId))
    .groupBy(dateTrunc('day', reviewLogTable.review), reviewLogTable.id, studyCardTable.id, cardTable.id);
    return result;
};

// Get number of review sessions per day/week/month
export const getReviewSessions = async (userId: string, period: 'day' | 'week' | 'month') => {
    const result = await db.select({
        period: dateTrunc(period, reviewLogTable.review),
        count: count()
    })
    .from(reviewLogTable)
    .innerJoin(studyCardTable, eq(reviewLogTable.cardId, studyCardTable.id))
    .innerJoin(cardTable, eq(studyCardTable.baseCardId, cardTable.id))
    .where(eq(cardTable.authorId, userId))
    .groupBy(dateTrunc(period, reviewLogTable.review),reviewLogTable.id, studyCardTable.id, cardTable.id);
    return result;
};

// Get total time spent studying per day/week/month
export const getTimeSpentStudying = async (userId: string, period: 'day' | 'week' | 'month') => {
    const result = await db.select({
        period: dateTrunc(period, reviewLogTable.review),
        totalDuration: sum(reviewLogTable.duration)
    })
    .from(reviewLogTable)
    .innerJoin(studyCardTable, eq(reviewLogTable.cardId, studyCardTable.id))
    .innerJoin(cardTable, eq(studyCardTable.baseCardId, cardTable.id))
    .where(eq(cardTable.authorId, userId))
    .groupBy(dateTrunc(period, reviewLogTable.review), reviewLogTable.id, studyCardTable.id, cardTable.id);
    return result;
};

// Get number of lapses and repetitions over time
export const getLapsesAndRepetitions = async (userId: string) => {
    const result = await db.select({
        date: dateTrunc('day', studyCardTable.last_review),
        lapses: sum(studyCardTable.lapses),
        reps: sum(studyCardTable.reps)
    })
    .from(studyCardTable)
    .innerJoin(cardTable, eq(studyCardTable.baseCardId, cardTable.id))
    .where(eq(cardTable.authorId, userId))
    .groupBy(dateTrunc('day', studyCardTable.last_review), studyCardTable.id, cardTable.id);
    return result;
};

// Get total number of cards created by the user
export const getTotalCards = async (userId: string) => {
    const result = await db.select({
        count: count()
    })
    .from(cardTable)
    .where(eq(cardTable.authorId, userId));
    return result[0].count;
};
//shit
// Get number of public cards created by the user
export const getPublicCards = async (userId: string) => {
    const result = await db.select({
        count: count()
    })
    .from(cardTable)
    .where(and(eq(cardTable.authorId, userId), eq(cardTable.public, true)));
    return result[0].count;
};

// Get number of private cards created by the user
export const getPrivateCards = async (userId: string) => {
    const totalCards = await getTotalCards(userId);
    const publicCards = await getPublicCards(userId);
    return totalCards - publicCards;
};

// Get number of cards by topic
export const getCardsByTopic = async (userId: string) => {
    const result = await db.select({
        topic: topicTable.name,
        count: count()
    })
    .from(cardTable)
    .innerJoin(topicTable, eq(cardTable.topicId, topicTable.id))
    .where(eq(cardTable.authorId, userId))
    .groupBy(topicTable.name);
    return result;
};
*/
