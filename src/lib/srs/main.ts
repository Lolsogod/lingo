import { createEmptyCard, type Grade as SRSGrade, type Card as SRSCard, repeat } from '.';

import {
	type Rating,
	type StudyCard,
	ratings, // будут ли проблемы с не типом с сервера?
	type NewReviewLog,
	type NewStudyCard
} from '../server/database/schema';

//создание параметры
const params = {
	request_retention: 0.9, //целевой уровень запоминания, Например, значение 0.9 означает, что система стремится к тому, чтобы пользователь запомнил 90% информации.
	maximum_interval: 100, //как долго карточка может оставаться без повторений
	w: [
		0.5701, 1.4436, 4.1386, 10.9355, 5.1443, 1.2006, 0.8627, 0.0362, 1.629, 0.1342, 1.0166, 2.1174,
		0.0839, 0.3204, 1.4676, 0.219, 2.8237
	], //Массив весовых коэффициентов. Эти коэффициенты влияют на скорость увеличения/уменьшения интрвалов.
	enable_fuzz: true //Включает фаззер, который добавляет небольшую случайность к интервалам. Это может помочь избежать заучивания карточек в одно и то же время каждый день, что может улучшить запоминание.
};

export const newStudyCard = (baseCardId: string, studyDeckId: string): NewStudyCard => {
	const emptyCard = createEmptyCard();
	return {
		...emptyCard,
		state: emptyCard.state,
		baseCardId,
		studyDeckId
	};
};

export const createStudyCard = (baseCardId: string, studyDeckId: string) => {
	const newCard = newStudyCard(baseCardId, studyDeckId);

	return newCard;
};
//grading

const ratingToSRSGrade = (rating: Rating): SRSGrade => {
	const index = ratings.indexOf(rating);
	if (index === -1) {
		throw new Error(`Invalid rating: ${rating}`);
	}

	return index as SRSGrade;
};

export const mergeSrsCard = (srsCard: SRSCard, card: StudyCard): StudyCard => {
	return {
		...card,
		...srsCard
	};
};
export const grade = (card: StudyCard, rating: Rating) => {
	const recordLog = repeat(card, params, (recordLog) => {
		const grade = ratingToSRSGrade(rating);
		const recordLogItem = recordLog[grade];
		const nextCard = mergeSrsCard(recordLogItem.card, card);
		const reviewLog: NewReviewLog = {
			...recordLogItem.log,
			id: crypto.randomUUID(),
			cardId: card.id,
			grade: rating,
			state: recordLogItem.log.state
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
