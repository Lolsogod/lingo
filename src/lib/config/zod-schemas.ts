import { z } from 'zod';
//TODO разделить всё даа
export const userSchema = z.object({
	firstName: z
		.string({ required_error: 'First Name is required' })
		.min(1, { message: 'First Name is required' })
		.trim(),
	lastName: z
		.string({ required_error: 'Last Name is required' })
		.min(1, { message: 'Last Name is required' })
		.trim(),
	email: z
		.string({ required_error: 'Email is required' })
		.email({ message: 'Please enter a valid email address' }),
	password: z
		.string({ required_error: 'Password is required' })
		.min(6, { message: 'Password must be at least 6 characters' })
		.trim(),
	confirmPassword: z
		.string({ required_error: 'Password is required' })
		.min(6, { message: 'Password must be at least 6 characters' })
		.trim(),
	//terms: z.boolean({ required_error: 'You must accept the terms and privacy policy' }),
	role: z
		.enum(['USER', 'PREMIUM', 'ADMIN'], {
			required_error: 'You must have a role'
		})
		.default('USER'),
	verified: z.boolean().default(false),
	terms: z.literal<boolean>(true, {
		errorMap: () => ({ message: 'You must accept the terms & privacy policy' })
	}),
	token: z.string().optional(),
	receiveEmail: z.boolean().default(true),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional()
});

export type UserSchema = typeof userSchema;

export const userUpdatePasswordSchema = userSchema
	.pick({ password: true, confirmPassword: true })
	.superRefine(({ confirmPassword, password }, ctx) => {
		if (confirmPassword !== password) {
			ctx.addIssue({
				code: 'custom',
				message: 'Password and Confirm Password must match',
				path: ['password']
			});
			ctx.addIssue({
				code: 'custom',
				message: 'Password and Confirm Password must match',
				path: ['confirmPassword']
			});
		}
	});

export type UserUpdatePasswordSchema = typeof userUpdatePasswordSchema;

export const signInSchema = userSchema.pick({ email: true, password: true });
export type SignInSchema = typeof signInSchema;
export const signUpSchema = userSchema.pick({
	firstName: true,
	lastName: true,
	email: true,
	password: true,
	terms: true
});

export type SignUpSchema = typeof signUpSchema;

export const editUserSchema = userSchema.pick({
	firstName: true,
	lastName: true,
	email: true
});
export type EditUserSchema = typeof editUserSchema;

export const resetPasswordSchema = userSchema.pick({ email: true });
export type ResetPasswordSchema = typeof resetPasswordSchema;

// колоды
export const deckSchema = z.object({
	name: z
		.string()
		.min(1, { message: 'Deck name is required' })
		.max(50, { message: 'Deck name is too long' }),
	description: z.string().optional(),
	public: z.boolean().default(false),
	authorId: z.string()
});
export type DeckSchema = typeof deckSchema;

export const createDeckSchema = deckSchema.pick({
	name: true,
	description: true,
	public: true
});
export type CreateDeckSchema = typeof createDeckSchema;

//карты
//блок отдельной схемой?
export const cardSchema = z.object({
	topicName: z.string().min(1, { message: 'Topic name is required' }),
	blocks: z
		.array(
			z.object({
				content: z.string()
			})
		)
		.min(1, { message: 'At least one block is required' })
});
export type CardSchema = typeof cardSchema;

export const createCardSchema = cardSchema.pick({
	topicName: true,
	blocks: true
});
//наверное все так задавать надо бы
export type CreateCardSchema = z.infer<typeof createCardSchema>;

export const userDeckSchema = z.object({
	deckId: z.string(),
	userId: z.string()
});
// is it even needed? maybe will be when adding from browse page
export const addDeckToUserSchema = userDeckSchema.pick({
	deckId: true
});
