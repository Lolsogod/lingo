import { sendPasswordResetEmail } from '$lib/config/email-messages';
import { resetPasswordSchema } from '$lib/config/zod-schemas';
import { getUserByEmail, updateUser } from '$lib/server/database/models/user';
import { fail, redirect } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { setError, superValidate } from 'sveltekit-superforms/server';

export const load = async (event) => {
	const form = await superValidate(event, zod(resetPasswordSchema));
	return {
		form
	};
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(resetPasswordSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			const user = await getUserByEmail(form.data.email);
			if (!user) {
				return setError(form, 'Указанный адрес электронной почты не связан с аккаунтом.');
			}
			console.log('reset user password');
			const token = crypto.randomUUID();
			await updateUser(user.id, { token: token });
			await sendPasswordResetEmail(form.data.email, token);
		} catch (e) {
			console.error(e);
			return setError(
				form,
				'Произошла ошибка при сбросе пароля. Если вам требуется дополнительная помощь, пожалуйста, обратитесь в службу поддержки.'
			);
		}
		redirect(302, '/auth/password/reset/success');
	}
};
