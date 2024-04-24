export const states = ["New", "Learning", "Review", "Relearning"] as const;
export type State = (typeof states)[number];