import { z } from 'zod';

export const blockSchema = z.object({
	id: z.string().optional(),
	type: z.string().min(1, { message: 'Выберите тип блока' }),
	content: z.string().min(1, { message: 'Введите содержание блока' }),
	isNew: z.boolean()
});

export const cardSchema = z.object({
	topicName: z.string().min(1, { message: 'Введите название темы карточки' }),
	blocks: z.array(blockSchema).min(1, { message: 'У карточки должен быть минимум 1 блок' }),
	addToStudy: z.boolean(),
	studyDeckId: z.string().optional()
});
export type CardSchema = typeof cardSchema;
//naming is wrong here but i am lazy
export const createCardSchema = cardSchema.pick({
	topicName: true,
	blocks: true,
	addToStudy: true,
	studyDeckId: true
});

//наверное все так задавать надо бы
export type CreateCardSchema = z.infer<typeof createCardSchema>;

export const cardDeckSchema = z.object({
	cardId: z.string(),
	deckId: z.string()
});

export const addCardToDeckSchema = cardDeckSchema.pick({
	cardId: true
});
//better validation for this one
export const gradeCardSchema = z.object({
	studyCardId: z.string(),
	direction: z.string()
});
