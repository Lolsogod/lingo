import type { SRSParameters, int } from '.';
import pseudorandom from 'seedrandom';
import { Grade } from '.';

//constatnts
const FUZZY_RANGES = [
	{
		start: 2.5,
		end: 7.0,
		factor: 0.15
	},
	{
		start: 7.0,
		end: 20.0,
		factor: 0.1
	},
	{
		start: 20.0,
		end: Infinity,
		factor: 0.05
	}
];

const DECAY: number = -0.5;
const FACTOR: number = 19 / 81;

export const getIntervalModifier = (request_retention: number): number => {
	return +((Math.pow(request_retention, 1 / DECAY) - 1) / FACTOR).toFixed(8);
};
export const initializeDifficulty = (g: Grade, param: SRSParameters): number => {
	return +Math.min(Math.max(param.w[4] - (g - 3) * param.w[5], 1), 10).toFixed(8);
};
export const initializeStability = (g: Grade, param: SRSParameters): number => {
	return Math.max(param.w[g - 1], 0.1);
};
export const getForgetCurve = (elapsed_days: number, stability: number): number => {
	return +Math.pow(1 + (FACTOR * elapsed_days) / stability, DECAY).toFixed(8);
};

export const nextDifficulty = (d: number, g: Grade, param: SRSParameters): number => {
	const next_d = d - param.w[6] * (g - 3);
	return limitDifficulty(revertToMean(param.w[4], next_d, param));
};
export const nextForgetStability = (
	d: number,
	s: number,
	r: number,
	param: SRSParameters
): number => {
	return +(
		param.w[11] *
		Math.pow(d, -param.w[12]) *
		(Math.pow(s + 1, param.w[13]) - 1) *
		Math.exp((1 - r) * param.w[14])
	).toFixed(8);
};

const limitDifficulty = (difficulty: number): number => {
	return Math.min(Math.max(+difficulty.toFixed(8), 1), 10);
};
const revertToMean = (init: number, current: number, param: SRSParameters): number => {
	return +(param.w[7] * init + (1 - param.w[7]) * current).toFixed(8);
};

export const getNextRecallStability = (
	d: number,
	s: number,
	r: number,
	param: SRSParameters
): number => {
	const hard_penalty = 1;
	const easy_bound = 1;
	return +(
		s *
		(1 +
			Math.exp(param.w[8]) *
				(11 - d) *
				Math.pow(s, -param.w[9]) *
				(Math.exp((1 - r) * param.w[10]) - 1) *
				hard_penalty *
				easy_bound)
	).toFixed(8);
};

export const fuzzy = (
	ivl: number,
	elapsed_days: number,
	maximum_interval: number,
	seed: string,
	enable_fuzz?: boolean
): int => {
	if (!enable_fuzz || ivl < 2.5) return Math.round(ivl) as int;
	const generator = pseudorandom(seed);
	const fuzz_factor = generator();
	const { min_ivl, max_ivl } = calcFuzzRange(ivl, elapsed_days, maximum_interval);
	return Math.floor(fuzz_factor * (max_ivl - min_ivl + 1) + min_ivl) as int;
};
const calcFuzzRange = (interval: number, elapsed_days: number, maximum_interval: number) => {
	let delta = 1.0;
	for (const range of FUZZY_RANGES) {
		delta += range.factor * Math.max(Math.min(interval, range.end) - range.start, 0.0);
	}
	interval = Math.min(interval, maximum_interval);
	let min_ivl = Math.max(2, Math.round(interval - delta));
	const max_ivl = Math.min(Math.round(interval + delta), maximum_interval);
	if (interval > elapsed_days) {
		min_ivl = Math.max(min_ivl, elapsed_days + 1);
	}
	min_ivl = Math.min(min_ivl, max_ivl);
	return { min_ivl, max_ivl };
};
