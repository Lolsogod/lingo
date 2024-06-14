import { getStudyDecks } from '$lib/server/database/models/deck';
import { getQueue } from '$lib/server/database/models/study';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const user = event.locals.user;
	if (!user?.id) {
		redirect(302, '/auth/sign-in');
	}
	const studyDecks = await getStudyDecks(user.id);
	//TODO: this is horendous
	const decksWithQueues = await Promise.all(
		studyDecks.map(async (deck) => {
			const queue = await getQueue(deck.id, deck.newCardsLimit);
			return { ...deck, queue };
		})
	);

	return { decksWithQueues };
};
