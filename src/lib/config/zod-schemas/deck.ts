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

export const userDeckSchema = z.object({
	deckId: z.string(),
	userId: z.string()
});
// is it even needed? maybe will be when adding from browse page
export const startStudySchema = deckSchema.pick({
	addToStudy: true
});
