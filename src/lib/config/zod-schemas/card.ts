import { z } from 'zod';

export const blockSchema = z.object({
	id: z.string().optional(),
	type: z.string().min(1, { message: 'Укажите тип блока' }),
	content: z.string().min(1, { message: 'Введите содержание блока' }),
	isNew: z.boolean()
});

export const commentSchema = z.object({
	topicId: z.string(),
	comment: z.string().min(1, { message: 'Введите комментарий' }),
	potentialTopicName: z.string(),
	type: z.enum(['text', 'markdown']).optional()

});
export const blockLikeSchema = z.object({
	blockId: z.string(),
	userId: z.string().optional(),
	liked: z.boolean()
});
export const cardSchema = z.object({
	topicName: z.string().min(1, { message: 'Введите название темы карточки' }),
	blocks: z.array(blockSchema).min(1, { message: 'У карточки должен быть минимум 1 блок' }),
	tags: z.string().optional(),
	addToStudy: z.boolean(),
	studyDeckId: z.string().optional()
});
export type CardSchema = typeof cardSchema;
//naming is wrong here but i am lazy
export const createCardSchema = cardSchema
	.pick({
		topicName: true,
		blocks: true,
		addToStudy: true,
		studyDeckId: true,
		tags: true
	})
	.refine((data) => !data.addToStudy || (data.addToStudy && data.studyDeckId), {
		message: 'Необходимо выбрать колоду для добавления карточки',
		path: ['studyDeckId']
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
export const addCardToDeckSchema2 = cardDeckSchema.pick({
	deckId: true
});
//better validation for this one
export const gradeCardSchema = z.object({
	studyCardId: z.string(),
	direction: z.string()
});
