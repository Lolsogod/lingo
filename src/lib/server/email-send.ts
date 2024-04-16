import { FROM_EMAIL, RESEND_KEY } from '$env/static/private';
import { Resend } from 'resend';

//not sure about resend yet, maybe change later
export default async function sendEmail(email: string, subject: string, bodyHtml?: string) {
	const resend = new Resend(RESEND_KEY);
	try {
		await resend.emails.send({
			from: `LinGo <${FROM_EMAIL}>`,
			to: [email],
			subject: subject,
			html: bodyHtml ? bodyHtml : ''
		});
		console.log('E-mail sent successfully!');
		return {
			statusCode: 200,
			message: 'Письмо успешно отправлено'
		};
	} catch (error) {
		throw new Error(`Ошибка при отправке письма: ${JSON.stringify(error)}`);
	}
}
