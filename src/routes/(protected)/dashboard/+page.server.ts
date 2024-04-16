import { getStudyDecks } from "$lib/server/database/deck-model.js";
import { redirect } from "@sveltejs/kit";

export const load = async (event) => {
	//везде почекать и убрать бросающиеся ошибки с редиректам(старый стиль)
	const user = event.locals.user;
	if (!user?.id) {
		redirect(302, "/auth/sign-in");
	}
	const studyDecks = await getStudyDecks(user.id);

	return { studyDecks };
};
