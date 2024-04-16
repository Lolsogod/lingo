import { z } from 'zod';

export const blockSchema = z.object({
	content: z.string().min(1, { message: 'Введите содержание блока' })
});

export const cardSchema = z.object({
	topicName: z.string().min(1, { message: 'Введите название темы карточки' }),
	blocks: z.array(blockSchema).min(1, { message: 'У карточки должен быть минимум 1 блок' })
});
export type CardSchema = typeof cardSchema;

export const createCardSchema = cardSchema.pick({
	topicName: true,
	blocks: true
});
//наверное все так задавать надо бы
export type CreateCardSchema = z.infer<typeof createCardSchema>;
