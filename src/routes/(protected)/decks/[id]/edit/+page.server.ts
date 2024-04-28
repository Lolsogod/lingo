import { editDeckSchema } from '$lib/config/zod-schemas';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { setFlash } from 'sveltekit-flash-message/server';
import { getDeckById, updateDeck } from '$lib/server/database/models/deck';
import type { Deck } from '$lib/server/database/schema';
import { error } from '@sveltejs/kit';

export const load = (async (event) => {
	const user = event.locals.user;
	const deckId = event.params.id;

    const form = await superValidate(event, zod(editDeckSchema));
	const deck = await getDeckById(deckId, user?.id);
	if (!deck) {
		return error(404, 'Deck not found');
	}

	form.data = {
		name: deck.name,
		description: deck.description?deck.description:'',
		public: deck.public,
	};
	
	return {
		form
	};
}) satisfies PageServerLoad;

export const actions = {
    default: async (event) => {
        const user = await event.locals.user;
		const deckId = event.params.id;
		let updatedDeck: Partial<Deck> | null;
        const form = await superValidate(event, zod(editDeckSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}
        try{
            if (!user?.id) {
				throw new Error('Invalid user');
			}
			updatedDeck = await updateDeck({
				id: deckId,
				name: form.data.name,
				description: form.data.description,
				public: form.data.public,
			}, user.id);
			if (updatedDeck?.id) {
				setFlash({ type: 'success', message: 'Колода изменена' }, event);
				}
        }catch(e){
            console.error(e);
			setFlash({ type: 'error', message: 'Не удалось создать колоду' }, event);
			return setError(form, 'name', 'Не удалось изменить колоду');
        }
		return {form}
    }
}