import { createDeckSchema } from "$lib/config/zod-schemas";
import { createDeck } from "$lib/server/database/deck-model";
import { fail } from "@sveltejs/kit";
import { setFlash } from "sveltekit-flash-message/server";
import { setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types";

export const load = (async (event) => {
	const form = await superValidate(event, zod(createDeckSchema));
	return {
		form,
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(createDeckSchema));
		if (!form.valid) {
			return fail(400, {
				form,
			});
		}
		//add deck to db
		try {
			//check for deck of same name
			const newDeck = await createDeck(form.data);
			if (newDeck) {
				setFlash({ type: "success", message: "Колода создана" }, event);
			}
		} catch (e) {
			console.error(e);
			setFlash({ type: "error", message: "Не удалось создать колоду" }, event);
			return setError(form, "name", "Колода с таким именем существует???");
		}
		console.log(form);
		return { form };
	},
};
