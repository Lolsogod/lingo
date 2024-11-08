import { relations, sql } from 'drizzle-orm';
import {
	pgTable,
	primaryKey,
	text,
	uuid,
	varchar,
	boolean,
	timestamp,
	real,
	integer
} from 'drizzle-orm/pg-core';
import { cardDeckTable, studyDeckTable, type CardDeck, type StudyDeck } from './deck';
import { userTable } from './user';
import { pgRatings, pgStates } from './enums';

export const topicTable = pgTable('topic', {
	id: uuid('id').notNull().primaryKey().defaultRandom(),
	name: varchar('name').notNull().unique()
});

export const blockTable = pgTable('block', {
	id: uuid('id').notNull().primaryKey().defaultRandom(),
	type: varchar('type').notNull().default('text'),
	content: text('content').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	topicId: uuid('topic_id')
		//.notNull() //TODO: on next reset change to .notNull()
		.references(() => topicTable.id),
	authorId: text('author_id')
		//.notNull() //TODO: on next reset change to .notNull()
		.references(() => userTable.id)
});

export const blockLikeTable = pgTable(
	'block_like',
	{
		userId: text('user_id')
			.notNull()
			.references(() => userTable.id),
		blockId: uuid('block_id')
			.notNull()
			.references(() => blockTable.id),
		liked: boolean('liked').notNull(),
		createdAt: timestamp('created_at').notNull().defaultNow()
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.userId, table.blockId] })
		};
	}
);

export const cardTable = pgTable('card', {
	id: uuid('id').notNull().primaryKey().defaultRandom(),
	topicId: uuid('topic_id')
		.notNull()
		.references(() => topicTable.id),
	public: boolean('public').notNull().default(true),
	authorId: text('author_id')
		.notNull()
		.references(() => userTable.id),
	tags: text('tags')
		.array()
		.notNull()
		.default(sql`'{}'::text[]`),
	level: integer('level').notNull().default(0)
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

//TODO: user deck rename to study deck
export const studyCardTable = pgTable('study_card', {
	id: uuid('id').notNull().primaryKey().defaultRandom(),
	studyDeckId: uuid('study_deck_id')
		.notNull()
		.references(() => studyDeckTable.id, { onDelete: 'cascade' }),
	baseCardId: uuid('card_id')
		.notNull()
		.references(() => cardTable.id),
	due: timestamp('due').notNull().defaultNow(),
	stability: real('stability').notNull(),
	difficulty: real('difficulty').notNull(),
	elapsed_days: integer('elapsed_days').notNull(),
	scheduled_days: integer('scheduled_days').notNull(),
	reps: integer('reps').notNull(),
	lapses: integer('lapses').notNull(),
	state: pgStates('states').notNull(),
	last_review: timestamp('last_review'),
	suspended: timestamp('suspended').notNull().defaultNow(),
	deleted: boolean('deleted').notNull().default(false),
	createdAt: timestamp('created_at').notNull().defaultNow()
});
export const reviewLogTable = pgTable('review_log', {
	id: text('id').primaryKey(),
	cardId: uuid('card_id')
		.notNull()
		.references(() => studyCardTable.id, { onDelete: 'cascade' }),
	grade: pgRatings('ratings').notNull(),
	state: pgStates('states').notNull(),
	due: timestamp('due').notNull(),
	stability: real('stability').notNull(),
	difficulty: real('difficulty').notNull(),
	elapsed_days: integer('elapsed_days').notNull(),
	last_elapsed_days: integer('last_elapsed_days').notNull(),
	scheduled_days: integer('scheduled_days').notNull(),
	review: timestamp('review').notNull(),
	duration: integer('duration').notNull().default(0),
	deleted: boolean('deleted').notNull().default(false),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

//relations
export const cardRelations = relations(cardTable, ({ one, many }) => {
	return {
		topic: one(topicTable, {
			fields: [cardTable.topicId],
			references: [topicTable.id]
		}),
		cardDeck: many(cardDeckTable),
		cardBlocks: many(cardBlockTable),
		author: one(userTable, {
			fields: [cardTable.authorId],
			references: [userTable.id]
		}),
		studyCard: many(studyCardTable)
	};
});
export const topicRelations = relations(topicTable, ({ many }) => {
	return {
		cards: many(cardTable)
	};
});
export const blockRelations = relations(blockTable, ({ many, one }) => {
	return {
		cards: many(cardBlockTable),
		author: one(userTable, {
			fields: [blockTable.authorId],
			references: [userTable.id]
		})
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

export const studyCardRelations = relations(studyCardTable, ({ one, many }) => {
	return {
		baseCard: one(cardTable, {
			fields: [studyCardTable.baseCardId],
			references: [cardTable.id]
		}),
		studyDeck: one(studyDeckTable, {
			fields: [studyCardTable.studyDeckId],
			references: [studyDeckTable.id]
		}),
		reviewLogs: many(reviewLogTable)
	};
});

export const reviewLogRelations = relations(reviewLogTable, ({ one }) => {
	return {
		studyCard: one(studyCardTable, {
			fields: [reviewLogTable.cardId],
			references: [studyCardTable.id]
		})
	};
});
//types
export type Topic = typeof topicTable.$inferSelect;
export type NewTopic = typeof topicTable.$inferInsert;

export type Block = typeof blockTable.$inferSelect;
export type NewBlock = typeof blockTable.$inferInsert;

export type Card = typeof cardTable.$inferSelect;
export type NewCard = typeof cardTable.$inferInsert;
export type CardExp = Card & {
	topic: Topic;
	isAdded?: boolean;
	cardDeck?: CardDeck[];
	cardBlocks?: CardBlockExp[];
};
export type CardBlock = typeof cardBlockTable.$inferSelect;
export type CardBlockExp = typeof cardBlockTable.$inferSelect & { block: NewBlock };
export type StudyCard = typeof studyCardTable.$inferSelect;
export type NewStudyCard = typeof studyCardTable.$inferInsert;
export type StudyCardExp = StudyCard & {
	baseCard: CardExp;
	reviewLogs?: ReviewLogExp[];
};

export type NewReviewLog = typeof reviewLogTable.$inferInsert;
export type ReviewLog = typeof reviewLogTable.$inferSelect;
export type ReviewLogExp = ReviewLog & {
	studyCard: StudyCard & {
		studyDeck: StudyDeck;
	};
};
