import { Resend } from 'resend';
import { RESEND_KEY, FROM_EMAIL } from '$env/static/private';

//not sure about resend yet, maybe change later
export default async function sendEmail(email: string, subject: string, bodyHtml?: string) {
	const resend = new Resend(RESEND_KEY);
	try {
		await resend.emails.send({
			from: `LinGo <${FROM_EMAIL}>`,
			to: [email],
			subject: subject,
			html: bodyHtml!
		});
		console.log('E-mail sent successfully!');
		return {
			statusCode: 200,
			message: 'E-mail sent successfully.'
		};
	} catch (error) {
		throw new Error(`Error sending email: ${JSON.stringify(error)}`);
	}
}