import { DATABASE_URL } from '$env/static/private';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema';
const pool = new pg.Pool({
	connectionString: DATABASE_URL
});

await pool.connect();
const db = drizzle(pool, { schema });

export default db;
