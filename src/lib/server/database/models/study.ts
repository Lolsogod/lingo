//think about naming
import { date_scheduler } from 'ts-fsrs';
import {
	states,
	studyCardTable,
	type Rating,
	reviewLogTable,
	type State,
	studyDeckTable
} from '../schema';
import { and, count, eq, gte, lte } from 'drizzle-orm';
import db from '../drizzle';
import { getStartOfDay, grade } from '$lib/fsrs';

export const gradeStudyCard = async (studyCardId: string, rating: Rating) => {
	const studyCard = await db.query.studyCardTable.findFirst({
		where: eq(studyCardTable.id, studyCardId)
	});

	if (!studyCard) {
		return null;
	}
	const { nextCard, reviewLog } = grade(studyCard, rating);
	const result = await db.transaction(async (tx) => {
		const updatedCard = await tx
			.update(studyCardTable)
			.set(nextCard)
			.where(eq(studyCardTable.id, studyCardId))
			.returning();
		await tx.insert(reviewLogTable).values(reviewLog);
		return updatedCard;
	});
	return result;
};

export const getStudyDeck = async (deckId: string, userId = '') => {
	const studyDeck = await db.query.studyDeckTable.findFirst({
		where: and(eq(studyCardTable.id, deckId), eq(studyDeckTable.userId, userId)),
		with: {
			studyCards: {
				with: { baseCard: { with: { topic: true, cardBlocks: { with: { block: true } } } } }
			},
			deck: true
		}
	});

	return studyDeck;
};

export const getTodayCount = async (studyDeckId: string, state?: State) => {
	const startOfDay = getStartOfDay();
	const nextDay = date_scheduler(startOfDay, 1, true);
	const todayCount = await db
		.select({ count: count() })
		.from(reviewLogTable)
		.innerJoin(studyCardTable, eq(reviewLogTable.cardId, studyCardTable.id))
		.where(
			and(
				eq(studyCardTable.studyDeckId, studyDeckId),
				lte(reviewLogTable.review, nextDay),
				gte(reviewLogTable.review, startOfDay),
				state ? eq(reviewLogTable.state, state) : undefined
			)
		);
	return todayCount[0].count;
};

export const getQueue = async (studyDeckId: string, limit: number) => {
	const todayNewCount = await getTodayCount(studyDeckId, 'New');
	const startOfDay = getStartOfDay();
	const queuePromises = states.map(async (state) => {
		if (state === 'New' && limit - todayNewCount <= 0) {
			return [];
		}
		return db.query.studyCardTable.findMany({
			limit: state === 'New' ? Math.max(1, limit - todayNewCount) : undefined,
			where: and(
				eq(studyCardTable.studyDeckId, studyDeckId),
				eq(studyCardTable.state, state),
				state === 'Review' ? lte(studyCardTable.due, startOfDay) : undefined
			),
			with: { baseCard: { with: { topic: true, cardBlocks: { with: { block: true } } } } }
		});
	});
	const queue = await Promise.all(queuePromises);
	const shuffledQueue = queue.flat().sort(() => Math.random() - Math.random()); //мб как то лучше можно
	return shuffledQueue;
};

export const setNewLimit = async (studyDeckId: string, limit: number) => {
	await db
		.update(studyDeckTable)
		.set({ newCardsLimit: limit })
		.where(eq(studyDeckTable.id, studyDeckId));
};

export const deleteStudyDeck = async (studyDeckId: string) => {
	try{
		await db.delete(studyDeckTable).where(eq(studyDeckTable.id, studyDeckId));//user_id check?
	}
	catch(e){
		console.log(e);
	}
};