//think about naming
import {
	createEmptyCard,
	fsrs,
	generatorParameters,
	type State as FSRSState,
	type Grade as FSRSGrade,
	type Card as FSRSCard
} from 'ts-fsrs';

import {
	states,
	type Rating,
	type State,
	type StudyCard,
	ratings, // будут ли проблемы с не типом с сервера?
	type NewReviewLog,
	type NewStudyCard
} from './server/database/schema';

const params = generatorParameters({
	enable_fuzz: true,
	maximum_interval: 100
});
const f = fsrs(params);

const fsrsStateToState = (state: FSRSState): State => {
	return states[state];
};

export const newStudyCard = (baseCardId: string, studyDeckId: string): NewStudyCard => {
	const emptyCard = createEmptyCard();
	return {
		...emptyCard,
		state: fsrsStateToState(emptyCard.state),
		baseCardId,
		studyDeckId
	};
};

export const createStudyCard = (baseCardId: string, studyDeckId: string) => {
	const newCard = newStudyCard(baseCardId, studyDeckId);

	return newCard;
};
//grading

const ratingToFSRSGrade = (rating: Rating): FSRSGrade => {
	const index = ratings.indexOf(rating);
	if (index === -1) {
		throw new Error(`Invalid rating: ${rating}`);
	}

	return index as FSRSGrade;
};

export const mergeFsrsCard = (fsrsCard: FSRSCard, card: StudyCard): StudyCard => {
	return {
		...card,
		...fsrsCard,
		state: fsrsStateToState(fsrsCard.state)
	};
};

export const grade = (card: StudyCard, rating: Rating, now = new Date()) => {
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
export const getStartOfDay = () => {
	const now = new Date();
	const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 4, 0, 0, 0);
	return startOfDay;
};
