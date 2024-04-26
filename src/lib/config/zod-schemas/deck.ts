import { z } from 'zod';

export const deckSchema = z.object({
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
export type CreateDeckSchema = typeof createDeckSchema;

export const studyDeckSchema = z.object({
	deckId: z.string(),
	userId: z.string()
});
// is it even needed? maybe will be when adding from browse page
export const startStudySchema = deckSchema.pick({
	addToStudy: true
});
//separate study schemas


export const studyDeckSettingsSchema = z.object({
	limit: z.coerce.number().int().min(0, { message: 'Количество новых карточек должно быть больше или равно 0' }),
});