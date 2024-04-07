import { Hono } from 'hono';
import { logger as honoLogger } from 'hono/logger';
import logger from '@/common/utils/logger';

const app = new Hono();

app.use('*', honoLogger());
app.get('/', (c) => {
  return c.text('Hello Hono! I am here forever 20');
});

logger.info('Server is running on port 3000');
export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
};
