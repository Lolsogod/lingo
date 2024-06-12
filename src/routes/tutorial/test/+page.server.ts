import { addDeckToUser, getAverageDeckLevel, getPublicDecks, getStudyDecksForDeck } from '$lib/server/database/models/deck';
import type { Deck } from '$lib/server/database/schema';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { finishTutorialSchema, startStudySchema } from '$lib/config/zod-schemas';
import { isUUID } from '$lib/_helpers/isUIID';
import { setFlash } from 'sveltekit-flash-message/server';
import { finishTutorial  } from '$lib/server/database/models/user';

export const load = (async (event) => {
    const user = event.locals?.user;
    if (!user) {
        redirect(302,'/login');
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    let publicDecks: (Deck & { level?: number, addForm?: SuperValidated<any>, alredyStudying?: boolean })[] = (await getPublicDecks(user?.id)) || [];
    publicDecks = await Promise.all(
		publicDecks.map(async (deck) => {
            const addForm = await superValidate(event, zod(startStudySchema), {
                id: deck.id
            });
            const studyDecks = await getStudyDecksForDeck(deck.id)
            const alredyStudying = studyDecks.some((sd) => sd.userId === user?.id);
			const level = await getAverageDeckLevel(deck.id!);
			return { ...deck, level: level || 0, addForm, alredyStudying };
		})
	);
    
    const form = await superValidate(event, zod(finishTutorialSchema));

    return {publicDecks, form};
}) satisfies PageServerLoad;

export const actions = {
    startStudy: async (event) => {
        console.log('adding')
		const startStudyForm = await superValidate(event, zod(startStudySchema));
		if (!startStudyForm.valid) {
			return fail(400, {
				startStudyForm
			});
		}
		const deckId = startStudyForm.id;
		const userId = event.locals.user?.id;
		if (!userId || !isUUID(deckId)) {
			return fail(400, {});
		}
		try {
			const result = await addDeckToUser(userId, deckId);
			if (result) {
				setFlash({ type: 'success', message: 'Колода добавлена в обучение' }, event);
			}
		} catch (e) {
			console.error(e);
			setFlash({ type: 'error', message: 'Не удалось добавить к обучению' }, event);
			return setError(startStudyForm, 'addToStudy', 'ошибка наверное');
		}

		return { startStudyForm };
	},
    finishTutorial: async (event) => {
        const form = await superValidate(event, zod(finishTutorialSchema));
        try{
            const userId = event.locals.user?.id;
            if (!userId) {
                return fail(400, {});
            }
            const result = await finishTutorial(userId, form.data.rating);
            if (result) {
                setFlash({ type: 'success', message: 'Уровень знания языка установлен успешно' }, event);
            }
        } catch (e) {
            console.error(e);
            setFlash({ type: 'error', message: 'Не удалось установить уровень знания языка' }, event);
        }
        return {form};
    }
}