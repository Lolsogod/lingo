import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, primaryKey, text, uuid, varchar } from 'drizzle-orm/pg-core';
import { userTable } from './user';
import { cardTable, studyCardTable, type StudyCard } from './card';

export const deckTable = pgTable('deck', {
	id: uuid('id').notNull().primaryKey().defaultRandom(),
	name: varchar('name').notNull(),
	description: text('description'),
	public: boolean('public').notNull().default(false),
	authorId: text('author_id')
		.notNull()
		.references(() => userTable.id),
	deleted: boolean('deleted').notNull().default(false)
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

export const studyDeckTable = pgTable('study_deck', {
	id: uuid('id').notNull().primaryKey().defaultRandom(),
	userId: text('user_id')
		.notNull()
		.references(() => userTable.id),
	deckId: uuid('deck_id')
		.notNull()
		.references(() => deckTable.id),
	newCardsLimit: integer('new_cards_limit').notNull().default(10) //TODO: check for greater than 0
});

//relations
export const deckRelations = relations(deckTable, ({ many, one }) => {
	return {
		cardDecks: many(cardDeckTable),
		author: one(userTable, {
			fields: [deckTable.authorId],
			references: [userTable.id]
		}),
		studyDecks: many(studyDeckTable)
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

export const studyDeckRelations = relations(studyDeckTable, ({ one, many }) => {
	return {
		user: one(userTable, {
			fields: [studyDeckTable.userId],
			references: [userTable.id]
		}),
		deck: one(deckTable, {
			fields: [studyDeckTable.deckId],
			references: [deckTable.id]
		}),
		studyCards: many(studyCardTable)
	};
});

//types
export type Deck = typeof deckTable.$inferSelect;
export type NewDeck = typeof deckTable.$inferInsert;

export type CardDeck = typeof cardDeckTable.$inferSelect;
export type NewCardDeck = typeof cardDeckTable.$inferInsert;

export type StudyDeck = typeof studyDeckTable.$inferSelect;
export type NewStudyDeck = typeof studyDeckTable.$inferInsert;
export type StudyDeckExp = StudyDeck & { deck: NewDeck; studyCards: StudyCard[] };
