import * as dotenv from 'dotenv';
import type { Config } from 'drizzle-kit';
dotenv.config();
const { DATABASE_URL } = process.env;
if (!DATABASE_URL) {
	throw new Error('No url');
}
export default {
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
} satisfies Config;
