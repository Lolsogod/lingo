import { relations } from 'drizzle-orm';
import { pgTable, primaryKey, text, uuid, varchar, boolean } from 'drizzle-orm/pg-core';
import { cardDeckTable } from './deck';
import { userTable } from './user';

export const topicTable = pgTable('topic', {
	id: uuid('id').notNull().primaryKey().defaultRandom(),
	name: varchar('name').notNull().unique()
});

export const blockTable = pgTable('block', {
	id: uuid('id').notNull().primaryKey().defaultRandom(),
	content: text('content').notNull()
});

export const cardTable = pgTable('card', {
	id: uuid('id').notNull().primaryKey().defaultRandom(),
	topicId: uuid('topic_id')
		.notNull()
		.references(() => topicTable.id),
	public: boolean('public').notNull().default(true),
	authorId: text('author_id')
		.notNull()
		.references(() => userTable.id)
});

export const cardBlockTable = pgTable(
	'card_block',
	{
		cardId: uuid('card_id')
			.notNull()
			.references(() => cardTable.id),
		blockId: uuid('block_id')
			.notNull()
			.references(() => blockTable.id)
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.cardId, table.blockId] })
		};
	}
);

//types
export type Card = typeof cardTable.$inferInsert;
export type CardWithTopic = Card & { topic: Topic };
export type Block = typeof blockTable.$inferInsert;
export type Topic = typeof topicTable.$inferInsert;

//relations
export const cardRelations = relations(cardTable, ({ one, many }) => {
	return {
		topic: one(topicTable, {
			fields: [cardTable.topicId],
			references: [topicTable.id]
		}),
		deck: many(cardDeckTable),
		blocks: many(cardBlockTable),
		author: one(userTable, {
			fields: [cardTable.authorId],
			references: [userTable.id]
		})
	};
});
export const topicRelations = relations(topicTable, ({ many }) => {
	return {
		cards: many(cardTable)
	};
});
export const blockRelations = relations(blockTable, ({ many }) => {
	return {
		cards: many(cardBlockTable)
	};
});
export const cardBlockRelations = relations(cardBlockTable, ({ one }) => {
	return {
		card: one(cardTable, {
			fields: [cardBlockTable.cardId],
			references: [cardTable.id]
		}),
		block: one(blockTable, {
			fields: [cardBlockTable.blockId],
			references: [blockTable.id]
		})
	};
});
