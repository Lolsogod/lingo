import { z } from 'zod';

export const deckSchema = z.object({
	name: z
		.string()
		.min(1, { message: 'Введите название колоды' })
		.max(50, { message: 'Название колоды не должно быть длинее 50 символов' }),
	description: z.string().optional(),
	public: z.boolean().default(false),
	authorId: z.string()
});
export type DeckSchema = typeof deckSchema;

export const createDeckSchema = deckSchema.pick({
	name: true,
	description: true,
	public: true
});
export type CreateDeckSchema = typeof createDeckSchema;
