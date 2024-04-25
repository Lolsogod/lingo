import { pgEnum } from "drizzle-orm/pg-core";

export const states = ["New", "Learning", "Review", "Relearning"] as const;
export const pgStates = pgEnum("states", states);
export type State = (typeof states)[number];


export const ratings = ["Manual", "Again", "Hard", "Good", "Easy"] as const;
export const pgRatings = pgEnum("ratings", ratings);
export type Rating = (typeof ratings)[number];