import { getStudyDeck } from '$lib/server/database/models/study';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { StudyCard } from '$lib/server/database/schema';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { gradeCardSchema } from '$lib/config/zod-schemas';


const countCardsByState = (cards: StudyCard[]): Count => {
    const initialState: Count = {
      New: 0,
      Learning: 0,
      Review: 0,
      Relearning: 0,
    };
  
    return cards.reduce((count, card) => {
      count[card.state]++;
      return count;
    }, initialState);
  };

//test queue



export const load = (async (event) => {
    //const user = event.locals.user;
	const studyDeckId = event.params.id;

    const studyDeck = await getStudyDeck(studyDeckId);
    if(!studyDeck) {
        error(404, 'Deck not found');
    }

    const stateCount = countCardsByState(studyDeck.studyCards);
    const form = await superValidate(event, zod(gradeCardSchema));
    
    return {studyDeck, stateCount, form};
}) satisfies PageServerLoad;

export const actions = {
  remember: async (event) => {
    console.log('remembe)');
  },
  forget: async (event) => {
    console.log('forget(');
  }
}