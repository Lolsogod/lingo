import { eq, sql } from 'drizzle-orm';
import db from '../drizzle';
import {
	blockTable,
	cardTable,
	deckTable,
	topicTable,
	userTable,
	type Block,
	type Card,
	type Deck,
	type Topic,
	type User
} from '../schema';
import { getBlockLikesDislikes, getCardById, getCardsByAuthor } from './card';
import { getDecksByAuthor, getLikesDislikes, softDeleteDeck } from './deck';

/*raw
export const getAllUsers = async () => {
	const users = await db.select().from(userTable);
	return users;
};

export const deleteUserById = async (userId: string) => {
	await db.delete(userTable).where(eq(userTable.id, userId));
};

export const getAllBlocks = async () => {
	const blocks = await db.select().from(blockTable);
	return blocks;
};

export const deleteBlockById = async (blockId: string) => {
	await db.delete(blockTable).where(eq(blockTable.id, blockId));
};

export const getAllCards = async () => {
	
	return cards;
};

export const deleteCardById = async (cardId: string) => {
	await db.delete(cardTable).where(eq(cardTable.id, cardId));
};


export const getAllDecks = async () => {
	const decks = await db.select().from(deckTable);
	return decks;
};

export const deleteDeckById = async (deckId: string) => {
	await db.delete(deckTable).where(eq(deckTable.id, deckId));
};

// Получить все колоды, отсортированные по рейтингу
export async function getAllDecksSortedByRating() {
	const decks = await getAllDecks();
	for (const deck of decks) {
		const { rating } = await getLikesDislikes(deck.id);
		deck.rating = rating;
	}
	decks.sort((a, b) => b.rating - a.rating);
	return decks;
}*/

// Получить все карты, отсортированные по рейтингу
export async function getAllCardsSortedByRating() {
	const cards: ({ cardId: string; topicName: string, authorId?: string } & { rating?: number })[] = await db
		.select({
			cardId: cardTable.id,
			topicName: topicTable.name,
			authorId: cardTable.authorId
		})
		.from(cardTable)
		.innerJoin(topicTable, eq(cardTable.topicId, topicTable.id));

	for (const card of cards) {
		card.rating = await calculateCardRating(card.cardId);
	}

	cards.sort((a, b) => a.rating! - b.rating!);
	return cards;
}

// Получить все блоки, отсортированные по рейтингу
export async function getAllBlocksSortedByRating() {
	const blocks: (Block & { rating?: number })[] = await db.select().from(blockTable);
	for (const block of blocks) {
		const { rating } = await getBlockLikesDislikes(block.id);
		block.rating = rating;
	}
	blocks.sort((a, b) => a.rating! - b.rating!);
	return blocks;
}

// Получить всех пользователей, отсортированных по рейтингу
export async function getAllUsersSortedByRating() {
	const users: ({ id: string; fullName: string } & { rating?: number })[] = await db
		.select({
			id: userTable.id,
			fullName: sql<string>`${userTable.firstName} || ' ' || ${userTable.lastName}`.as('fullName')
		})
		.from(userTable);
	for (const user of users) {
		user.rating = await calculateUserRating(user.id);
	}
	users.sort((a, b) => a.rating! - b.rating!);
	return users;
}

export const getAllDecks = async () => {
	const decks = await db.select().from(deckTable).where(eq(deckTable.deleted, false));
	return decks;
};

export async function getAllDecksSortedByRating() {
	const decks: (Deck & { rating?: number })[] = await getAllDecks();
	for (const deck of decks) {
		const { rating } = await getLikesDislikes(deck.id);
		deck.rating = rating;
	}
	decks.sort((a, b) => a.rating! - b.rating!);
	return decks;
}

// Удалить колоду по ID
export async function deleteDeck(deckId: string) {
	await softDeleteDeck(deckId, 'userId', true);
}
/*
// Удалить карту по ID
export async function deleteCard(cardId: string) {
	await deleteCardById(cardId);
}

// Удалить блок по ID
export async function deleteBlock(blockId: string) {
	await deleteBlockById(blockId);
}

// Удалить пользователя по ID
export async function deleteUser(userId: string) {
	await deleteUserById(userId);
}
*/
// Пример функции для расчета рейтинга карты
async function calculateCardRating(cardId: string) {
	const card = await getCardById(cardId);
	const blocks = card?.cardBlocks.map((block) => block.block) || [];
	const totalRating = await Promise.all(
		blocks.map(async (block) => {
			const { rating } = await getBlockLikesDislikes(block.id);
			return rating;
		})
	);
	return totalRating.reduce((sum, rating) => sum + rating, 0) / blocks.length;
}
export const getBlocksByAuthor = async (authorId: string) => {
	const blocks = await db.select().from(blockTable).where(eq(blockTable.authorId, authorId));
	return blocks;
};
// Пример функции для расчета рейтинга пользователя
async function calculateUserRating(userId: string) {
	const decks = (await getDecksByAuthor(userId)) || [];
	const cards = (await getCardsByAuthor(userId)) || [];
	const blocks = (await getBlocksByAuthor(userId)) || [];

	const deckRatings = await Promise.all(
		decks.map(async (deck) => {
			const { rating } = await getLikesDislikes(deck.id);
			return rating;
		})
	);

	const cardRatings = await Promise.all(
		cards.map(async (card) => {
			return await calculateCardRating(card.id);
		})
	);

	const blockRatings = await Promise.all(
		blocks.map(async (block) => {
			const { rating } = await getBlockLikesDislikes(block.id);
			return rating;
		})
	);

	const totalRating = [...deckRatings, ...cardRatings, ...blockRatings].reduce(
		(sum, rating) => sum + rating,
		0
	);

	const count = decks.length + cards.length + blocks.length;
	return count > 0 ? totalRating / count : 0;
}
