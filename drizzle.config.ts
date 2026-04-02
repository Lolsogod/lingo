import * as dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';
dotenv.config();
const { DATABASE_URL } = process.env;
if (!DATABASE_URL) {
	throw new Error('DATABASE_URL is not set');
}
export default defineConfig({
	schema: './src/lib/server/database/schema',
	out: './src/lib/server/database/migrations',
	dialect: 'postgresql',
	dbCredentials: {
		url: DATABASE_URL
	},
	migrations: {
		table: 'migrations',
		schema: 'public'
	}
});
