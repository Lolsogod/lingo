import {
	getDecksByAuthor,
	getPublicDecks,
	getDeckTags,
	getAverageDeckLevel,
	getStudyDecksForDeck
} from '$lib/server/database/models/deck';
import { getRecommendedDifficulty } from '$lib/server/database/models/user';
import type { Deck } from '$lib/server/database/schema';
import { superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { startStudySchema } from '$lib/config/zod-schemas';

export const load = (async (event) => {
	const user = event.locals.user;
	const recommendedDifficulty = await getRecommendedDifficulty(user!.id, user!.initialLevel);
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	//@ts-ignore
	let publicDecks: (Deck & { level?: number })[] = (await getPublicDecks(user?.id)) || [];
	let userCreatedDecks: (Deck & { level?: number })[] = (await getDecksByAuthor(user?.id)) || [];

	const query = event.url.searchParams.get('q') || null;
	const tagQuery =
		event.url.searchParams
			.get('tag')
			?.split(',')
			.map((tag) => tag.trim())
			.filter((tag) => tag !== '') || null;
	console.log(userCreatedDecks.length);
	if (query) {
		publicDecks = publicDecks.filter((deck) =>
			deck.name.toLowerCase().includes(query.toLowerCase())
		);
		userCreatedDecks = userCreatedDecks.filter((deck) =>
			deck.name.toLowerCase().includes(query.toLowerCase())
		);
	}
	if (tagQuery?.length) {
		console.log(userCreatedDecks.length);
		publicDecks = (
			await Promise.all(
				publicDecks.map(async (deck) => {
					const deckTags = await getDeckTags(deck.id!);
					const hasTag = tagQuery.some((tag) => deckTags.includes(tag));
					return hasTag ? deck : null;
				})
			)
		).filter((deck): deck is NonNullable<typeof deck> => deck !== null);

		userCreatedDecks = (
			await Promise.all(
				userCreatedDecks.map(async (deck) => {
					const deckTags = await getDeckTags(deck.id!);
					const hasTag = tagQuery.some((tag) => deckTags.includes(tag));
					return hasTag ? deck : null;
				})
			)
		).filter((deck): deck is NonNullable<typeof deck> => deck !== null);
	}

	publicDecks = await Promise.all(
		publicDecks.map(async (deck) => {
			const addForm = await superValidate(event, zod(startStudySchema), {
                id: deck.id
            });
            const studyDecks = await getStudyDecksForDeck(deck.id)
            const alredyStudying = studyDecks.some((sd) => sd.userId === user?.id);
			const level = await getAverageDeckLevel(deck.id!);
			return { ...deck, level: level || 0, addForm ,alredyStudying };
		})
	);

	userCreatedDecks = await Promise.all(
		userCreatedDecks.map(async (deck) => {
			const addForm = await superValidate(event, zod(startStudySchema), {
                id: deck.id
            });
            const studyDecks = await getStudyDecksForDeck(deck.id)
            const alredyStudying = studyDecks.some((sd) => sd.userId === user?.id);
			const level = await getAverageDeckLevel(deck.id!);
			return { ...deck, level: level || 0, addForm, alredyStudying };
		})
	);
	console.log(userCreatedDecks.length);
	return { publicDecks, userCreatedDecks, recommendedDifficulty };
}) satisfies PageServerLoad;
