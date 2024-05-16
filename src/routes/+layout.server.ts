import { loadFlash } from 'sveltekit-flash-message/server';
import type { LayoutServerLoad } from './$types';
export const load = loadFlash(async (event) => {
	return { user: event.locals.user, url: event.url.pathname };
}) satisfies LayoutServerLoad;
