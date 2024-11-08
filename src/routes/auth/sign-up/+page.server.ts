import { sendVerificationEmail } from '$lib/config/email-messages';
import { signUpSchema } from '$lib/config/zod-schemas';
import { createUser } from '$lib/server/database/models/user';
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
	const form = await superValidate(event, zod(signUpSchema));
	return {
		form
	};
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(signUpSchema));
		//console.log(form);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			const password = await new Argon2id().hash(form.data.password);
			const token = crypto.randomUUID();
			const id = crypto.randomUUID();
			const user = {
				id: id,
				email: form.data.email.toLowerCase(),
				firstName: form.data.firstName,
				lastName: form.data.lastName,
				password: password,
				role: 'USER',
				verified: false,
				receiveEmail: true,
				token: token,
				createdAt: new Date(),
				updatedAt: new Date()
			};
			const newUser = await createUser(user);
			if (!newUser) {
				throw new Error('Failed to create user');
			}
			await sendVerificationEmail(newUser.email, token);
			const session = await lucia.createSession(newUser.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
			setFlash(
				{
					type: 'success',
					message:
						'Учетная запись создана. Пожалуйста, проверьте свою электронную почту, чтобы подтвердить свою учетную запись.'
				},
				event
			);
		} catch (e) {
			console.error(e);
			setFlash({ type: 'error', message: 'Не удалось создать учетную запись.' }, event);
			// email already in use
			//might be other type of error but this is most common and this is how lucia docs sets the error to duplicate user
			return setError(
				form,
				'email',
				'Пользователь с таким адресом электронной почты уже существует.'
			);
		}
		return { form };
	}
};
