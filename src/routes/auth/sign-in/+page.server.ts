import { signInSchema } from '$lib/config/zod-schemas';
import { getUserByEmail } from '$lib/server/database/models/user';
import { lucia } from '$lib/server/lucia';
import { fail, redirect } from '@sveltejs/kit';
import { Argon2id } from 'oslo/password';
import { setFlash } from 'sveltekit-flash-message/server';
import { zod } from 'sveltekit-superforms/adapters';
import { setError, superValidate } from 'sveltekit-superforms/server';

export const load = async (event) => {
	if (event.locals.user) {
		redirect(302, '/dashboard');
	}
	const form = await superValidate(event, zod(signInSchema));
	return {
		form
	};
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(signInSchema));
		//console.log(form);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		// добавить пользователя в базу данных
		try {
			const email = form.data.email.toLowerCase();
			const existingUser = await getUserByEmail(email);
			if (!existingUser) {
				setFlash({ type: 'error', message: 'Неверный адрес электронной почты или пароль.' }, event);
				return setError(form, 'Неверный адрес электронной почты или пароль.');
			}

			if (existingUser.password) {
				const validPassword = await new Argon2id().verify(
					existingUser.password,
					form.data.password
				);
				if (!validPassword) {
					setFlash(
						{ type: 'error', message: 'Неверный адрес электронной почты или пароль.' },
						event
					);
					return setError(form, 'Неверный адрес электронной почты или пароль.');
				}
				// пароль верный - установить сессию
				const session = await lucia.createSession(existingUser.id, {});
				const sessionCookie = lucia.createSessionCookie(session.id);
				event.cookies.set(sessionCookie.name, sessionCookie.value, {
					path: '.',
					...sessionCookie.attributes
				});
				setFlash({ type: 'success', message: 'Успешный вход.' }, event);
			}
		} catch (e) {
			//TODO: нужно вернуть сообщение об ошибке клиенту
			console.error(e);
			// электронная почта уже используется
			//const { fieldErrors: errors } = e.flatten();
			setFlash({ type: 'error', message: 'Неверный адрес электронной почты или пароль.' }, event);
			return setError(form, 'Неверный адрес электронной почты или пароль.');
		}

		return { form };
	}
};
