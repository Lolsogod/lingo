import { createCardSchema } from "$lib/config/zod-schemas";
import {
	addCardToDeck,
	createCard,
	getCardsByDeckId,
} from "$lib/server/database/card-models";
import { getDeckById } from "$lib/server/database/deck-model";
import { error, fail } from "@sveltejs/kit";
import { setFlash } from "sveltekit-flash-message/server";
import { setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types";

export const load = (async (event) => {
	const user = event.locals.user;
	const deckId = event.params.id;

	const deck = await getDeckById(deckId, user?.id);
	if (!deck) {
		return error(404, "Deck not found");
	}
	const form = await superValidate(event, zod(createCardSchema));
	const cards = await getCardsByDeckId(deckId);

	return { deck, form, cards };
}) satisfies PageServerLoad;

// код повторяется пофиксить
export const actions = {
	default: async (event) => {
		const deckId = event.params.id;
		const form = await superValidate(event, zod(createCardSchema));
		if (!form.valid) {
			return fail(400, {
				form,
			});
		}
		//add card to db
		try {
			const newCard = await createCard(form.data);
			const newCardDeck = await addCardToDeck(deckId, newCard.id);
			if (newCard && newCardDeck) {
				setFlash(
					{ type: "success", message: "Карта создана и добавленна в колоду" },
					event,
				);
			}
		} catch (e) {
			console.error(e);
			setFlash({ type: "error", message: "Не удалось создать карту" }, event);
			return setError(form, "blocks._errors", "ошибка наверное");
		}
		console.log(form);
		return { form };
	},
};
