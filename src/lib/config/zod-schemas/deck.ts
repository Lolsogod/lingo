import { z } from 'zod';

export const deckSchema = z.object({
	deckId: z.string().optional(),
	name: z
		.string()
		.min(1, { message: 'Введите название колоды' })
		.max(50, { message: 'Название колоды не должно быть длинее 50 символов' }),
	description: z.string().optional(),
	public: z.boolean().default(false),
	addToStudy: z.boolean().default(true), // окуратнее можно сломать кнопку добавления
	authorId: z.string()
});
export type DeckSchema = typeof deckSchema;

export const createDeckSchema = deckSchema.pick({
	name: true,
	description: true,
	public: true,
	addToStudy: true // отдельную схему мб, неуверен
});

export const editDeckSchema = deckSchema.pick({
	name: true,
	description: true,
	public: true
});

export type CreateDeckSchema = typeof createDeckSchema;

export const studyDeckSchema = z.object({
	deckId: z.string(),
	userId: z.string()
});
// is it even needed? maybe will be when adding from browse page
export const startStudySchema = deckSchema.pick({
	deckId: true,
	addToStudy: true
});
//separate study schemas

export const studyDeckSettingsSchema = z.object({
	timer: z.coerce.number().min(0, { message: 'Время должно быть больше или равно 0' }),
	limit: z.coerce
		.number()
		.int()
		.min(0, { message: 'Количество новых карточек должно быть больше или равно 0' })
});

export const deleteDeckSchema = z.object({});

export const likeSchema = z.object({
	deckId: z.string().optional(),
	userId: z.string().optional(),
	liked: z.boolean()
});

export const dislikeSchema = likeSchema;

export const skipSchema = z.object({});

export const finishTutorialSchema = z.object({
	rating: z.number().min(0).max(5)
})
