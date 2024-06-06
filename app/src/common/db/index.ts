import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';

import logger from '@/common/utils/logger';

const client = new Client({
  connectionString: process.env.DB_URL,
});

(async function () {
  await client.connect();
  logger.info('Connected to database');
})();

const db = drizzle(client);
export default db;
