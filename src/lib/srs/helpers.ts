import type { Card, DateInput } from './types';

export function formatDate(value: unknown) {
	if (typeof value === 'object' && value instanceof Date) {
		return value;
	} else if (typeof value === 'string') {
		const timestamp = Date.parse(value);
		if (!isNaN(timestamp)) {
			return new Date(timestamp);
		} else {
			throw new Error(`Invalid date:[${value}]`);
		}
	} else if (typeof value === 'number') {
		return new Date(value);
	}
	throw new Error(`Invalid date:[${value}]`);
}
export const createEmptyCard = <R = Card>(now?: DateInput, after?: (card: Card) => R): R => {
	const emptyCard: Card = {
		due: now ? formatDate(now) : new Date(),
		stability: 0,
		difficulty: 0,
		elapsed_days: 0,
		scheduled_days: 0,
		reps: 0,
		lapses: 0,
		state: 'New',
		last_review: undefined
	};
	if (after && typeof after === 'function') {
		return after(emptyCard);
	} else {
		return emptyCard as R;
	}
};

export const dateScheduler = (now: DateInput, t: number, isDay?: boolean): Date => {
	return new Date(
		isDay
			? formatDate(now).getTime() + t * 24 * 60 * 60 * 1000
			: formatDate(now).getTime() + t * 60 * 1000
	);
};

export const getDateDifference = (now: Date, pre: Date): number => {
	const diff = now.getTime() - pre.getTime();
	return Math.floor(diff / (24 * 60 * 60 * 1000));
};
