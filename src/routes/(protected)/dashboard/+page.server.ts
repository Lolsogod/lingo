import { getStudyDecks } from '$lib/server/database/models/deck';
import { getTodayNewCount } from '$lib/server/database/models/study.js';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	//везде почекать и убрать бросающиеся ошибки с редиректам(старый стиль)
	const user = event.locals.user;
	if (!user?.id) {
		redirect(302, '/auth/sign-in');
	}
	const studyDecks = await getStudyDecks(user.id);
	const decksWithNewCounts = await Promise.all(
		studyDecks.map(async (deck) => {
			const newCount = await getTodayNewCount(deck.id);
			return { ...deck, newCount };
		})
	);

	return { decksWithNewCounts };
};
