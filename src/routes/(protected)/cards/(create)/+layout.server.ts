import type { LayoutServerLoad } from './$types';
import { createCardSchema } from '$lib/config/zod-schemas';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { getDecksByAuthor } from '$lib/server/database/models/deck';
import { findBlocks } from '$lib/server/database/models/card';

interface Base { //дублируется
	title: string;
	subTitle: string;
	alt: { text: string }[];
	meanings: any[];
}

export const load = (async (event) => {
	const user = event.locals.user;
	const baseParam = event.url.searchParams.get('base');
	const base: Base = JSON.parse(decodeURIComponent(baseParam ?? ''))

	const form = await superValidate(event, zod(createCardSchema));
	const decks = await getDecksByAuthor(user?.id);
	if(base){
		form.data.topicName = base.title;
		form.data.blocks.push({
			content: base.subTitle,
			type: 'text',
			isNew: true,
		});
		base.meanings.forEach((meaning) => {
			form.data.blocks.push({
				content: meaning,
				type: 'text',
				isNew: true,
			});
		})
	}

	return { form, decks };
}) satisfies LayoutServerLoad;
