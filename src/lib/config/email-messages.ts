import { APP_NAME, BASE_URL } from '$lib/config/constants';
import sendEmail from '$lib/server/email-send';

// Send an email to verify the user's address
export const sendVerificationEmail = async (email: string, token: string) => {
	const verifyEmailURL = `${BASE_URL}/auth/verify/email-${token}`;
	const htmlEmail = `<p>Пожалуйста, нажмите на эту <a href="${verifyEmailURL}">ссылку</a>, чтобы подтвердить адрес электронной почты для учетной записи ${APP_NAME}.</p> <p>Вы также можете перейти по ссылке ниже.</p><p>${verifyEmailURL}</p><p>Если вы не создавали эту учетную запись, вы можете проигнорировать это письмо.</p> <p>Если вы не создавали эту учетную запись, вы можете пропустить это письмо.`;
	const subject = `Подтверждение почты${APP_NAME}`;
	const resultSend = sendEmail(email, subject, htmlEmail);
	return resultSend;
};

// Send an email to welcome the new user
export const sendWelcomeEmail = async (email: string) => {
	const htmlEmail = `<p>Спасибо за подтверждение вашей учетной записи в ${APP_NAME}.</p><p>Теперь вы можете <a href="${BASE_URL}/auth/sign-in">войти</a> в свою учетную запись.</p>`;
	const subject = `Добро пожаловать в ${APP_NAME}`;
	const resultSend = sendEmail(email, subject, htmlEmail);
	return resultSend;
};

// Send an email to reset the user's password
export const sendPasswordResetEmail = async (email: string, token: string) => {
	const updatePasswordURL = `${BASE_URL}/auth/password/update-${token}`;
	const htmlEmail = `<p>Пожалуйста, нажмите на эту <a href="${updatePasswordURL}">ссылку</a>, чтобы изменить свой пароль для ${APP_NAME}.</p>  
	<p>Вы также можете перейти по ссылке ниже.</p><p>${updatePasswordURL}</p><p>Если вы не запрашивали смену пароля, можете проигнорировать это письмо.</p>`;
	const subject = `Смена пароля для ${APP_NAME}`;
	const resultSend = sendEmail(email, subject, htmlEmail);
	return resultSend;
};

// Send an email to confirm the user's password reset
// and also send an email to the user's old email account in case of a hijack attempt
export const updateEmailAddressSuccessEmail = async (
	email: string,
	oldEmail: string,
	token: string
) => {
	const verifyEmailURL = `${BASE_URL}/auth/verify/email-${token}`;
	const htmlEmail = `<p>Пожалуйста, нажмите на эту <a href="${verifyEmailURL}">ссылку</a>, чтобы подтвердить адрес электронной почты для вашей учетной записи ${APP_NAME}.</p> <p>Вы также можете перейти по ссылке ниже.</p><p>${verifyEmailURL}</p>`;
	const subject = `Пожалуйста, подтвердите свой адрес электронной почты для ${APP_NAME}`;
	sendEmail(email, subject, htmlEmail);

	//send email to user about email change.
	const htmlEmailChange = `<p>Your ${APP_NAME} account email has been updated from ${oldEmail} to ${email}.</p><p>If you DID NOT request this change, please contact support at: <a href='${BASE_URL}'>${BASE_URL}</a> to revert the changes.</p>`;
	const subjectChange = `Your email address for ${APP_NAME} has changed.`;
	sendEmail(oldEmail, subjectChange, htmlEmailChange);
};
