import { getDecksByAuthor, getPublicDecks, getDeckTags } from '$lib/server/database/models/deck';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
	const user = event.locals.user;
	let publicDecks = await getPublicDecks(user?.id) || [];
	let userCreatedDecks = await getDecksByAuthor(user?.id) || [];

	const query = event.url.searchParams.get('q') || null;
	const tagQuery =
		event.url.searchParams
			.get('tag')
			?.split(',')
			.map((tag) => tag.trim())
			.filter((tag) => tag !== '') || null;
			console.log(userCreatedDecks.length);
	if (query) {
		publicDecks = publicDecks.filter(deck => 
			deck.name.toLowerCase().includes(query.toLowerCase())
		);
		userCreatedDecks = userCreatedDecks.filter(deck => 
			deck.name.toLowerCase().includes(query.toLowerCase())
		);
	}
	if (tagQuery?.length) {
		console.log(userCreatedDecks.length);
		publicDecks = (await Promise.all(publicDecks.map(async (deck) =>  {
			const deckTags = await getDeckTags(deck.id!);
			const hasTag = tagQuery.some(tag => deckTags.includes(tag));
			return hasTag ? deck : null;
		}))).filter((deck): deck is NonNullable<typeof deck> => deck !== null);

		userCreatedDecks = (await Promise.all(userCreatedDecks.map(async (deck) => {
			const deckTags = await getDeckTags(deck.id!);
			const hasTag = tagQuery.some(tag => deckTags.includes(tag));
			return hasTag ? deck : null;
		}))).filter((deck): deck is NonNullable<typeof deck> => deck !== null);
	}
	console.log(userCreatedDecks.length);
	return { publicDecks, userCreatedDecks };
}) satisfies PageServerLoad;
