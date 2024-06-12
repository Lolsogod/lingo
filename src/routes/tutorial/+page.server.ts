import { superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { skipSchema } from '$lib/config/zod-schemas';
import { skipTutorial } from '$lib/server/database/models/user';
import { setFlash } from 'sveltekit-flash-message/server';

export const load = (async (event) => {
    const skipForm = await superValidate(event, zod(skipSchema));
    return { skipForm };
}) satisfies PageServerLoad;

export const actions = {
    skip: async (event) => {
        const form = await superValidate(event, zod(skipSchema));
        const user = event.locals.user;
        console.log(user)
        if (!user) {
            return { form };
        }
        try {
            const result = await skipTutorial(user.id);
            if (result) {
                setFlash({ type: 'success', message: 'Тест пропущен' }, event);
            } else {
                throw new Error('Не удалось пропустить тест');
            }
        } catch (error) {
            console.error(error);
            setFlash({ type: 'error', message: 'Не удалось пропустить тест' }, event);
        }
        return { form };
    }
}