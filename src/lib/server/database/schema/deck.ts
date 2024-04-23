import { relations } from 'drizzle-orm';
import { boolean, pgTable, primaryKey, text, uuid, varchar } from 'drizzle-orm/pg-core';
import { userTable } from './user';
import { cardTable } from './card';

export const deckTable = pgTable('deck', {
	id: uuid('id').notNull().primaryKey().defaultRandom(),
	name: varchar('name').notNull(),
	description: text('description'),
	public: boolean('public').notNull().default(false),
	authorId: text('author_id')
		.notNull()
		.references(() => userTable.id)
});

export const cardDeckTable = pgTable(
	'card_deck',
	{
		cardId: uuid('card_id')
			.notNull()
			.references(() => cardTable.id),
		deckId: uuid('deck_id')
			.notNull()
			.references(() => deckTable.id)
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.cardId, table.deckId] })
		};
	}
);

export const userDeckTable = pgTable(
	'user_deck',
	{
		userId: text('user_id')
			.notNull()
			.references(() => userTable.id),
		deckId: uuid('deck_id')
			.notNull()
			.references(() => deckTable.id)
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.userId, table.deckId] })
		};
	}
);

//types
export type Deck = typeof deckTable.$inferInsert;
export type CardDeck = typeof cardDeckTable.$inferInsert;
export type StudyDeck = typeof userDeckTable.$inferInsert & { deck: Deck };

//relations
export const deckRelations = relations(deckTable, ({ many, one }) => {
	return {
		cards: many(cardDeckTable),
		author: one(userTable, {
			fields: [deckTable.authorId],
			references: [userTable.id]
		}),
		userDecks: many(userDeckTable)
	};
});

export const cardDeckRelations = relations(cardDeckTable, ({ one }) => {
	return {
		card: one(cardTable, {
			fields: [cardDeckTable.cardId],
			references: [cardTable.id]
		}),
		deck: one(deckTable, {
			fields: [cardDeckTable.deckId],
			references: [deckTable.id]
		})
	};
});

export const userDeckRelations = relations(userDeckTable, ({ one }) => {
	return {
		user: one(userTable, {
			fields: [userDeckTable.userId],
			references: [userTable.id]
		}),
		deck: one(deckTable, {
			fields: [userDeckTable.deckId],
			references: [deckTable.id]
		})
	};
});
