//think about naming
import {
	createEmptyCard,
	fsrs,
	generatorParameters,
	type State as FSRSState,
	type Grade as FSRSGrade,
	type Card as FSRSCard,
	date_scheduler
} from 'ts-fsrs';

import {
	states,
	studyCardTable,
	type Rating,
	type State,
	type StudyCard,
	ratings,
	type NewReviewLog,
	reviewLogTable,
	type NewStudyCard
} from '../schema';
import { and, count, eq, gte, lte } from 'drizzle-orm';
import db from '../drizzle';
//todo kind of mess not realy a model, but also kind of is idk
const params = generatorParameters({
	enable_fuzz: true,
	maximum_interval: 100
});
const f = fsrs(params);

const fsrsStateToState = (state: FSRSState): State => {
	return states[state];
};

export const newStudyCard = (baseCardId: string, userDeckId: string): NewStudyCard => {
	const emptyCard = createEmptyCard();
	return {
		...emptyCard,
		state: fsrsStateToState(emptyCard.state),
		baseCardId,
		userDeckId
	};
};

export const createStudyCard = (baseCardId: string, userDeckId: string) => {
	const newCard = newStudyCard(baseCardId, userDeckId);

	return newCard;
};
//grading

function ratingToFSRSGrade(rating: Rating): FSRSGrade {
	const index = ratings.indexOf(rating);
	if (index === -1) {
		throw new Error(`Invalid rating: ${rating}`);
	}

	return index as FSRSGrade;
}

export function mergeFsrsCard(fsrsCard: FSRSCard, card: StudyCard): StudyCard {
	return {
		...card,
		...fsrsCard,
		state: fsrsStateToState(fsrsCard.state)
	};
}

export const grade = (card: StudyCard, rating: Rating, now = new Date()) => {
	//TODO: делать ли вобще рекорд логи? потом подумаю
	const recordLog = f.repeat(card, now, (recordLog) => {
		const grade = ratingToFSRSGrade(rating);
		const recordLogItem = recordLog[grade];
		const nextCard = mergeFsrsCard(recordLogItem.card, card);
		const reviewLog: NewReviewLog = {
			...recordLogItem.log,
			id: crypto.randomUUID(),
			cardId: card.id,
			grade: rating,
			state: fsrsStateToState(recordLogItem.log.state)
		};
		return {
			nextCard,
			reviewLog
		};
	});
	return recordLog;
};

export const gradeStudyCard = async (studyCardId: string, rating: Rating) => {
	const studyCard = await db.query.studyCardTable.findFirst({
		where: eq(studyCardTable.id, studyCardId)
	});

	if (!studyCard) {
		return null; //or better throw an error?
	}

	const { nextCard, reviewLog } = grade(studyCard, rating);
	console.log(nextCard);
	await db.transaction(async (tx) => {
		await tx.update(studyCardTable).set(nextCard).where(eq(studyCardTable.id, studyCardId));
		await tx.insert(reviewLogTable).values(reviewLog);
	});
};

//deck and stuff
export const getStudyDeck = async (deckId: string) => {
	const studyDeck = await db.query.userDeckTable.findFirst({
		where: eq(studyCardTable.id, deckId),
		with: {
			studyCards: {
				with: { baseCard: { with: { topic: true, blocks: { with: { block: true } } } } }
			}
		} //to separate call(cause this is too large kind of)
	});

	return studyDeck;
};
export const getStartOfDay = () => {
	const now = new Date();
	const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 4, 0, 0, 0);
	return startOfDay;
};

export const getTodayCount = async (studyDeckId: string) => {
	const startOfDay = getStartOfDay();
	const nextDay = date_scheduler(startOfDay, 1, true);
	const todayCount = await db
		.select({ count: count() })
		.from(reviewLogTable)
		.innerJoin(studyCardTable, eq(reviewLogTable.cardId, studyCardTable.id))
		.where(
			and(
				eq(studyCardTable.userDeckId, studyDeckId),
				lte(reviewLogTable.review, nextDay),
				gte(reviewLogTable.review, startOfDay)
			)
		);
	return todayCount[0].count;
};

export const getQueue = async (studyDeckId: string, limit: number) => {
	const todayCount = await getTodayCount(studyDeckId);
	const startOfDay = getStartOfDay();
	const queuePromises = states.map(async (state) =>
		db.query.studyCardTable.findMany({
			limit: state === 'New' ? Math.max(0, limit - todayCount) : undefined,
			where: and(
				eq(studyCardTable.userDeckId, studyDeckId),
				eq(studyCardTable.state, state),
				state === 'Review' ? lte(studyCardTable.due, startOfDay) : undefined
			),
			with: { baseCard: { with: { topic: true, blocks: { with: { block: true } } } } }
		})
	);
	const queue = await Promise.all(queuePromises);
	return queue;
};
