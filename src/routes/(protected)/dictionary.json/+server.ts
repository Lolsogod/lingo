import { json } from '@sveltejs/kit';
import words from './p1.json';

export const prerender = true;

export async function GET() {
	return json(words);
}
