import log from '$lib/server/log';
import { lucia } from '$lib/server/lucia';
import { type Handle, redirect } from '@sveltejs/kit';
import type { HandleServerError } from '@sveltejs/kit';

export const handleError: HandleServerError = async ({ error, event }) => {
	const errorId = crypto.randomUUID();

	event.locals.error = error?.toString() || '';
	if (error instanceof Error) {
		event.locals.errorStackTrace = error.stack || '';
	} else {
		event.locals.errorStackTrace = '';
	}
	event.locals.errorId = errorId;
	log(500, event);

	return {
		message: 'Произошла непредвиденая ошибка',
		errorId
	};
};
export const handle: Handle = async ({ event, resolve }) => {
	const startTimer = Date.now();
	event.locals.startTimer = startTimer;
	const sessionId = event.cookies.get(lucia.sessionCookieName);
	if (event.route.id?.startsWith('/(protected)') || event.route.id?.startsWith('/tutorial')) {
		if (!sessionId) redirect(302, '/auth/sign-in');
		//TODO: set up resend domain, for now no verification needed
		//if (!user.verified) redirect(302, '/auth/verify/email');
	}
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}
	const { session, user } = await lucia.validateSession(sessionId);
	if (session?.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}
	if (!session) {
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}
	event.locals.user = user;
	event.locals.session = session;

	if (event.route.id?.startsWith('/(admin)')) {
		if (user?.role !== 'ADMIN') redirect(302, '/auth/sign-in');
	}

	if (event.route.id?.startsWith('/(protected)') && !user?.tutorialCompleted) {
		redirect(302, '/tutorial');
	}
	if (event.route.id?.startsWith('/tutorial') && user?.tutorialCompleted) {
		redirect(302, '/');
	}
	const response = await resolve(event);
	log(response.status, event);
	return response;
};
