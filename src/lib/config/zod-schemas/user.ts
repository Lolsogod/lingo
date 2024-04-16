import { z } from 'zod';
export const userSchema = z.object({
	firstName: z
		.string({ required_error: 'Имя не может быть пустым' })
		.min(1, { message: 'Имя не может быть пустым' })
		.trim(),
	lastName: z
		.string({ required_error: 'Фамилия не может быть пустой' })
		.min(1, { message: 'Фамилия не может быть пустой' })
		.trim(),
	email: z
		.string({ required_error: 'Email не может быть пустым' })
		.email({ message: 'Пожалуйста, введите корректный адрес электронной почты' }),
	password: z
		.string({ required_error: 'Введите пароль' })
		.min(6, { message: 'Password must be at least 6 characters' })
		.trim(),
	confirmPassword: z
		.string({ required_error: 'Password is required' })
		.min(6, { message: 'Пароль должен состоять не менее чем из 6 символов' })
		.trim(),
	//terms: z.boolean({ required_error: 'You must accept the terms and privacy policy' }),
	role: z
		.enum(['USER', 'PREMIUM', 'ADMIN'], {
			required_error: 'У вас должна быть роль'
		})
		.default('USER'),
	verified: z.boolean().default(false),
	terms: z.literal<boolean>(true, {
		errorMap: () => ({ message: 'Вы должны принять условия и политику конфиденциальности' })
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
				message: 'Пароли должны совпадать',
				path: ['password']
			});
			ctx.addIssue({
				code: 'custom',
				message: 'Пароли должны совпадать',
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
