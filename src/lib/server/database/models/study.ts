//think about naming
import {
	createEmptyCard,
	fsrs,
	generatorParameters,
	type State as FSRSState,
	type Grade as FSRSGrade,
	type Card as FSRSCard,
} from 'ts-fsrs';

import { states, studyCardTable, type Rating, type State, type StudyCard, ratings } from '../schema';
import { eq } from 'drizzle-orm';
import db from '../drizzle';
//todo kind of mess not realy a model, but also kind of is idk
const params = generatorParameters({
	enable_fuzz: true,
	maximum_interval: 100,
  });
const f = fsrs(params);


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
	  state: fsrsStateToState(fsrsCard.state),
	};
  }

export const grade = (card: StudyCard, rating: Rating, now = new Date()) => {
	//TODO: делать ли вобще рекорд логи? потом подумаю
	const recordLog = f.repeat(card, now, (recordLog) => {
		const grade = ratingToFSRSGrade(rating);
		const recordLogItem = recordLog[grade];
		const nextCard = mergeFsrsCard(recordLogItem.card, card);
		return {
			nextCard,
			/*reviewLog, неуверн пока надо ли*/
		  };
	})
	return recordLog
}

export const gradeStudyCard = async (studyCardId: string, rating: Rating) => {
	const studyCard = await db.query.studyCardTable.findFirst({
		where: eq(studyCardTable.id, studyCardId)
	});

	if (!studyCard) {
		return null; //or better throw an error?
	}

	const { nextCard } = grade(studyCard, rating);
	console.log(nextCard)
	//TODO: finish up grading
	await db.update(studyCardTable).set(nextCard).where(eq(studyCardTable.id, studyCardId));
	
	console.log('graded?')
}
