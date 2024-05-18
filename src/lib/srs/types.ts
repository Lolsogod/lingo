export interface ReviewLog {
	rating: Rating; // Rating of the review (Again, Hard, Good, Easy)
	state: State; // State of the review (New, Learning, Review, Relearning) //TODO: Fuck enums i guess
	due: Date; // Date of the last scheduling
	stability: number; // Memory stability during the review
	difficulty: number; // Difficulty of the card during the review
	elapsed_days: number; // Number of days elapsed since the last review
	last_elapsed_days: number; // Number of days between the last two reviews
	scheduled_days: number; // Number of days until the next review
	review: Date; // Date of the review
}
export interface Card {
	due: Date; // Due date
	stability: number; // Stability
	difficulty: number; // Difficulty level
	elapsed_days: number; // Number of days elapsed
	scheduled_days: number; // Number of days scheduled
	reps: number; // Repetition count
	lapses: number; // Number of lapses or mistakes
	state: State; // Card's state (New, Learning, Review, Relearning)
	last_review?: Date | null; // Date of the last review (optional) //null can break probably
}

export type int = number & { __int__: void };
export type RecordLogItem = {
	card: Card;
	log: ReviewLog;
};
export type RecordLog = {
	[key in Grade]: RecordLogItem;
};

export type State = 'New' | 'Learning' | 'Review' | 'Relearning';
export enum Rating {
	Again = 1,
	Good = 3
}

export enum Grade {
	Again = 1,
	Good = 3
}
export type DateInput = Date | number | string;

export type SchedulingCard = {
	again: Card;
	good: Card;
	last_review: Date;
	last_elapsed_days: number;
};
export interface SRSParameters {
	request_retention: number;
	maximum_interval: number;
	w: number[];
	enable_fuzz: boolean;
}
