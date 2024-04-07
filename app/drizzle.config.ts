import type { Config } from 'drizzle-kit';

export default {
  schema: '.src/common/db/schema.ts',
  out: './drizzle/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DB_URL,
  },
} satisfies Config;
