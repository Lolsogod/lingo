import { userUpdatePasswordSchema } from '$lib/config/zod-schemas';
import { getUserByToken, updateUser } from '$lib/server/database/models/user';
import { fail, redirect } from '@sveltejs/kit';
import { Argon2id } from 'oslo/password';
import { zod } from 'sveltekit-superforms/adapters';
import { setError, superValidate } from 'sveltekit-superforms/server';
export const load = async (event) => {
	const form = await superValidate(event, zod(userUpdatePasswordSchema));
	return {
		form
	};
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(userUpdatePasswordSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			const token = event.params.token as string;

			console.log('update user password');
			const newToken = crypto.randomUUID();
			//get email from token
			const user = await getUserByToken(token);

			if (user) {
				const password = await new Argon2id().hash(form.data.password);
				// need to update with new token because token is also used for verification
				// and needs a new verification token in case user has not verified their account
				// and already forgot their password before verifying. Now they can get a new one resent.
				await updateUser(user.id, { token: newToken, password: password });
			} else {
				return setError(
					form,
					'Адрес электронной почты не найден для данного токена. Если вам нужна дополнительная помощь, пожалуйста, свяжитесь с поддержкой.'
				);
			}
		} catch (e) {
			console.error(e);
			return setError(
				form,
				'Произошла проблема с сбросом вашего пароля. Если вам нужна дополнительная помощь, пожалуйста, свяжитесь с поддержкой.'
			);
		}
		const token = event.params.token as string;
		redirect(302, `/auth/password/update-${token}/success`);
		//		return { form };
	}
};
