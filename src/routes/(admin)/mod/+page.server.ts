import { getAllBlocksSortedByRating, getAllCardsSortedByRating, getAllUsersSortedByRating, getAllDecksSortedByRating, deleteDeck } from '$lib/server/database/models/mod';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async () => {
    const cards = await getAllCardsSortedByRating()
    const decks = await getAllDecksSortedByRating()
    const blocks = await getAllBlocksSortedByRating()
    const users = await getAllUsersSortedByRating()
    return { cards, decks, blocks, users };
}) satisfies PageServerLoad;

export const actions = {
	deleteDeck: async ({ request }: { request: Request }) => {
		const formData = await request.formData();
		const deckId = formData.get('deckId') as string;
		await deleteDeck(deckId);
        console.log('succes')
        return { success: true }
	}
}

