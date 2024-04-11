import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { Hono } from 'hono';
import { logger as honoLogger } from 'hono/logger';

import userRouter from '@/api/user/userRouter';
import db from '@/common/db';
import logger from '@/common/utils/logger';

const app = new Hono();

app.use('*', honoLogger());

// Routes
app.route('/user', userRouter);

(async function () {
  await migrate(db, { migrationsFolder: './drizzle/migrations' });
})();

logger.info('Server is running on port 3000');
export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
};
