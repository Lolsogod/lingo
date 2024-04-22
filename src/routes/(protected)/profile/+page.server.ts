import { updateEmailAddressSuccessEmail } from '$lib/config/email-messages';
import { editUserSchema } from '$lib/config/zod-schemas';
import { updateUser } from '$lib/server/database/models/user';
import { error, fail } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { zod } from 'sveltekit-superforms/adapters';
import { message, setError, superValidate } from 'sveltekit-superforms/server';

export const load = async (event) => {
	const form = await superValidate(event, zod(editUserSchema));

	const user = event.locals.user;
	if (!user) {
		error(401, {
			message: 'Вы должны быть авторизованы, чтобы просмотреть эту страницу.'
		});
	}
	form.data = {
		firstName: user.firstName,
		lastName: user.lastName,
		email: user.email
	};
	return {
		form
	};
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(editUserSchema));
		//console.log(form);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		//add user to db
		try {
			console.log('updating profile');
			const user = event.locals.user;
			if (user) {
				await updateUser(user.id, {
					firstName: form.data.firstName,
					lastName: form.data.lastName,
					email: form.data.email
				});
				setFlash({ type: 'success', message: 'Профиль успешно обновлён' }, event);
			}

			if (user?.email !== form.data.email) {
				if (user) {
					await updateUser(user?.userId, {
						verified: false
					});
					await updateEmailAddressSuccessEmail(form.data.email, user?.email, user?.token);
				}
			}
		} catch (e) {
			console.error(e);
			return setError(form, 'Не удалось обновить профиль');
		}
		console.log('profile updated successfully');
		console.log(form.data);
		return message(form, 'Профиль успешно обновлён');
	}
};
