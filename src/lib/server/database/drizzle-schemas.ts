import { relations } from "drizzle-orm";
import {
	boolean,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

//TODO: seoparate all this
export const userTable = pgTable("users", {
	id: text("id").notNull().primaryKey(),
	provider: text("provider").notNull().default("email"),
	providerId: text("provider_id").notNull().default(""),
	email: text("email").notNull().unique(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	role: text("role").notNull().default("USER"),
	verified: boolean("verified").notNull().default(false),
	receiveEmail: boolean("receive_email").notNull().default(true),
	password: text("password"),
	token: text("token").unique(),
	createdAt: timestamp("created_at", {
		withTimezone: true,
		mode: "date",
	}).notNull(),
	updatedAt: timestamp("updated_at", {
		withTimezone: true,
		mode: "date",
	}).notNull(),
});

export const sessionTable = pgTable("sessions", {
	id: text("id").notNull().primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => userTable.id),
	expiresAt: timestamp("expires_at", {
		withTimezone: true,
		mode: "date",
	}).notNull(),
});

export const topic = pgTable("topic", {
	id: uuid("id").notNull().primaryKey().defaultRandom(),
	content: varchar("content").notNull().unique(),
});

export const block = pgTable("block", {
	id: uuid("id").notNull().primaryKey().defaultRandom(),
	content: text("content").notNull(),
});

export const card = pgTable("card", {
	id: uuid("id").notNull().primaryKey().defaultRandom(),
	content: text("content").notNull(),
	topicId: uuid("topic_id")
		.notNull()
		.references(() => topic.id),
});

export const deck = pgTable("deck", {
	id: uuid("id").notNull().primaryKey().defaultRandom(),
	name: varchar("name").notNull(),
	description: text("description"),
	public: boolean("public").notNull().default(false),
});

export const cardDeck = pgTable(
	"card_deck",
	{
		cardId: uuid("card_id")
			.notNull()
			.references(() => card.id),
		deckId: uuid("deck_id")
			.notNull()
			.references(() => deck.id),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.cardId, table.deckId] }),
		};
	},
);
//types
export type User = typeof userTable.$inferInsert;
export type UpdateUser = Partial<typeof userTable.$inferInsert>;
export type Session = typeof sessionTable.$inferInsert;
export type Deck = typeof deck.$inferInsert;
export type Card = typeof card.$inferInsert;
export type Block = typeof block.$inferInsert;
export type Topic = typeof topic.$inferInsert;

//relations
export const cardRelations = relations(card, ({ one, many }) => {
	return {
		topic: one(topic, {
			fields: [card.topicId],
			references: [topic.id],
		}),
		deck: many(cardDeck),
	};
});
export const topicRelations = relations(topic, ({ many }) => {
	return {
		cards: many(card),
	};
});

export const deckRelations = relations(deck, ({ many }) => {
	return {
		cards: many(cardDeck),
	};
});

export const cardDeckRelations = relations(cardDeck, ({ one }) => {
	return {
		card: one(card, {
			fields: [cardDeck.cardId],
			references: [card.id],
		}),
		deck: one(deck, {
			fields: [cardDeck.deckId],
			references: [deck.id],
		}),
	};
});
