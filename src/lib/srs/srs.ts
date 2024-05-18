import type { SRSParameters, Card, RecordLog, int, SchedulingCard } from '.';
import {
	Rating,
	dateScheduler,
	Grade,
	getIntervalModifier,
	getForgetCurve,
	initializeDifficulty,
	initializeStability,
	nextDifficulty,
	nextForgetStability,
	getNextRecallStability,
	fuzzy,
	getDateDifference
} from '.';

//повторение карты
export const repeat = <R = RecordLog>(
	studyCard: Card,
	params: SRSParameters,
	after?: (recordLog: RecordLog) => R
): R => {
	const now = new Date();
	const intervalModifier = getIntervalModifier(params.request_retention); // тут 1

	let scheduledCard = preScheduleCard(studyCard, now);
	const seed = String(now.getTime()) + studyCard.state; //ext??

	let goodInterval;
	const interval = studyCard.elapsed_days;
	//расчёт интервалов стабильности и тд
	if (studyCard.state === 'New') {
		scheduledCard = initDifficultyStability(scheduledCard, params);
		scheduledCard.again.due = dateScheduler(now, 1); //повторять через 1 мин
		scheduledCard.good.due = dateScheduler(now, 10); //повторять через 10 мин
	} else if (studyCard.state === 'Learning' || studyCard.state === 'Relearning') {
		goodInterval = getNextInterval(
			scheduledCard.good.stability,
			interval,
			params,
			intervalModifier,
			seed
		);
		scheduledCard = scheduleIntervals(scheduledCard, now, goodInterval);
	} else if (studyCard.state === 'Review') {
		const last_d = studyCard.difficulty;
		const last_s = studyCard.stability;
		const retrievability = getForgetCurve(interval, last_s);
		scheduledCard = updateDifficultyStability(
			scheduledCard,
			last_d,
			last_s,
			retrievability,
			params
		);
		goodInterval = getNextInterval(
			scheduledCard.good.stability,
			interval,
			params,
			intervalModifier,
			seed
		);
		scheduledCard = scheduleIntervals(scheduledCard, now, goodInterval);
	}

	const recordLog = getRecordLog(studyCard, now, scheduledCard);
	if (after) {
		return after(recordLog);
	}

	return recordLog as unknown as R;
};

const preScheduleCard = (card: Card, now: Date): SchedulingCard => {
	const last_review = card.last_review || card.due; //штуки для логов
	const last_elapsed_days = card.elapsed_days;
	card.elapsed_days = card.state === 'New' ? 0 : getDateDifference(now, card.last_review as Date); //у новой 0 для других разница от последнего повторения
	card.last_review = now;
	card.reps++;
	const again = { ...card };
	const good = { ...card };

	//смена стейта карточки
	if (card.state === 'New') {
		again.state = 'Learning';
		good.state = 'Learning';
	} else if (card.state === 'Learning' || card.state === 'Relearning') {
		good.state = 'Review';
	} else if (card.state === 'Review') {
		again.state = 'Relearning';
		good.state = 'Review';
	}

	return { again, good, last_review, last_elapsed_days };
};

const getRecordLog = (card: Card, now: Date, sCard: SchedulingCard): RecordLog => {
	return {
		[Rating.Again]: {
			card: sCard.again,
			log: {
				rating: Rating.Again,
				state: card.state,
				due: sCard.last_review,
				stability: card.stability,
				difficulty: card.difficulty,
				elapsed_days: card.elapsed_days,
				last_elapsed_days: sCard.last_elapsed_days,
				scheduled_days: card.scheduled_days,
				review: now
			}
		},
		[Rating.Good]: {
			card: sCard.good,
			log: {
				rating: Rating.Good,
				state: card.state,
				due: sCard.last_review,
				stability: card.stability,
				difficulty: card.difficulty,
				elapsed_days: card.elapsed_days,
				last_elapsed_days: sCard.last_elapsed_days,
				scheduled_days: card.scheduled_days,
				review: now
			}
		}
	};
};

//misc
const initDifficultyStability = (
	initial_card: SchedulingCard,
	param: SRSParameters
): SchedulingCard => {
	const scard = initial_card;
	scard.again.difficulty = initializeDifficulty(Grade.Again, param);
	scard.again.stability = initializeStability(Grade.Again, param);
	scard.good.difficulty = initializeDifficulty(Grade.Good, param);
	scard.good.stability = initializeStability(Grade.Good, param);

	return scard;
};
const updateDifficultyStability = (
	initial_card: SchedulingCard,
	last_d: number,
	last_s: number,
	retrievability: number,
	param: SRSParameters
): SchedulingCard => {
	const result = initial_card;
	result.again.difficulty = nextDifficulty(last_d, Grade.Again, param);
	result.again.stability = nextForgetStability(last_d, last_s, retrievability, param);
	result.good.difficulty = nextDifficulty(last_d, Grade.Good, param);
	result.good.stability = getNextRecallStability(last_d, last_s, retrievability, param);
	return result;
};

const getNextInterval = (
	stability: number,
	elapsed_days: number,
	param: SRSParameters,
	intervalModifier: number,
	seed: string
): int => {
	const newInterval = Math.min(
		Math.max(1, Math.round(stability * intervalModifier)),
		param.maximum_interval
	) as int;
	return fuzzy(newInterval, elapsed_days, param.maximum_interval, seed, param.enable_fuzz);
};

const scheduleIntervals = (
	initialCard: SchedulingCard,
	now: Date,
	good_interval: number
): SchedulingCard => {
	const result = initialCard;
	result.again.scheduled_days = 0;
	result.again.due = dateScheduler(now, 5);
	result.good.scheduled_days = good_interval;
	result.good.due = dateScheduler(now, good_interval, true);
	return result;
};
