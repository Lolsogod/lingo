import { relations } from 'drizzle-orm';
import {
	boolean,
	integer,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uuid,
	varchar
} from 'drizzle-orm/pg-core';
import { userTable } from './user';
import { cardTable, studyCardTable, type StudyCard, type StudyCardExp } from './card';

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
	newCardsLimit: integer('new_cards_limit').notNull().default(10),
	timer: integer('timer').notNull().default(60),
	deleted: boolean('deleted').notNull().default(false) //TODO: add soft delete (to save statistics)
});

export const deckLikeTable = pgTable(
	'deck_like',
	{
		userId: text('user_id')
			.notNull()
			.references(() => userTable.id),
		deckId: uuid('deck_id')
			.notNull()
			.references(() => deckTable.id),
		liked: boolean('liked').notNull(),
		createdAt: timestamp('created_at').notNull().defaultNow()
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.userId, table.deckId] })
		};
	}
);

//relations
export const deckRelations = relations(deckTable, ({ many, one }) => {
	return {
		cardDecks: many(cardDeckTable),
		author: one(userTable, {
			fields: [deckTable.authorId],
			references: [userTable.id]
		}),
		studyDecks: many(studyDeckTable),
		deckLikes: many(deckLikeTable)
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

export const deckLikeRelations = relations(deckLikeTable, ({ one }) => {
	return {
		user: one(userTable, {
			fields: [deckLikeTable.userId],
			references: [userTable.id]
		}),
		deck: one(deckTable, {
			fields: [deckLikeTable.deckId],
			references: [deckTable.id]
		})
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
export type StudyDeckExpPlus = StudyDeck & { deck: NewDeck; studyCards: StudyCardExp[] };
export type DeckLike = typeof deckLikeTable.$inferSelect;
export type NewDeckLike = typeof deckLikeTable.$inferInsert;
