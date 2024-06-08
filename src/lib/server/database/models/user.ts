import db from '$lib/server/database/drizzle';
import { cardTable, reviewLogTable, studyCardTable, studyDeckTable, userTable } from '$lib/server/database/schema';
import type { ReviewLog, ReviewLogExp, UpdateUser, User } from '$lib/server/database/schema';
import { desc, eq, type SQLWrapper } from 'drizzle-orm';

export const getUserByEmail = async (email: string) => {
	const user = await db.select().from(userTable).where(eq(userTable.email, email));
	if (user.length === 0) {
		return null;
	}
	return user[0];
};

export const getUserByToken = async (token: string) => {
	const user = await db.select().from(userTable).where(eq(userTable.token, token));
	if (user.length === 0) {
		return null;
	}
	return user[0];
};

export const updateUser = async (id: string, user: UpdateUser) => {
	const result = await db.update(userTable).set(user).where(eq(userTable.id, id)).returning();
	if (result.length === 0) {
		return null;
	}
	return result[0];
};

export const createUser = async (user: User) => {
	const result = await db.insert(userTable).values(user).onConflictDoNothing().returning();
	if (result.length === 0) {
		return null;
	}
	return result[0];
};

//difficulty recomendation
const calculateAverageLevel = (reviews: {grade: "Manual" | "Again" | "Hard" | "Good" | "Easy",level: number}[]) => 
    reviews.reduce((sum, review) => sum + review.level, 0) / reviews.length;

export const getRecommendedDifficulty = async (userId: string, recentCount = 200) => {
    const userReviews = await db
        .select({
            grade: reviewLogTable.grade,
            level: cardTable.level
        })
        .from(reviewLogTable)
        .innerJoin(studyCardTable, eq(reviewLogTable.cardId, studyCardTable.id))
        .innerJoin(studyDeckTable, eq(studyCardTable.studyDeckId, studyDeckTable.id))
        .innerJoin(cardTable, eq(studyCardTable.baseCardId, cardTable.id))
        .where(eq(studyDeckTable.userId, userId))
        .orderBy(desc(reviewLogTable.review))
        .limit(recentCount);

    const positiveReviews = userReviews.filter(review => review.grade == "Good");
    const averageLevel = calculateAverageLevel(positiveReviews);

    const recentGrades = userReviews.map(review => review.grade);
    const averageGrade = recentGrades.reduce((sum, grade) => sum + (grade == "Good" ? 1 : 0), 0) / recentGrades.length;

    if (averageGrade >= .75) return averageLevel + 1;
    if (averageGrade <= .25) return averageLevel - 1;

	if (averageLevel < 0) return 0;
	if (averageLevel > 5) return 5;

    return Math.round(averageLevel);
};

