//think about naming
import {
	createEmptyCard,
	type State as FSRSState
} from 'ts-fsrs';
import { states, studyCardTable, type State, type StudyCard } from '../schema';
import db from '../drizzle';
import type { PgTransaction } from 'drizzle-orm/pg-core';


const fsrsStateToState = (state: FSRSState): State =>{
	return states[state];
}

export const newStudyCard = (baseCardId: string, userDeckId: string): StudyCard => {
	const emptyCard = createEmptyCard();
	return {
		...emptyCard,
		state: fsrsStateToState(emptyCard.state),
        baseCardId,
        userDeckId,
	};
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createStudyCard = async (baseCardId: string, userDeckId: string, tx?: any) => {
	//вынести логику добавления в базу?
	let result
    const newCard = newStudyCard(baseCardId, userDeckId);
	if (tx) {
		result = await tx.insert(studyCardTable).values(newCard).returning();
	}else{
		result = await db.insert(studyCardTable).values(newCard).returning();
	}
    return result[0];
};
