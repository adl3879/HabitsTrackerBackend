import type { Config } from 'drizzle-kit';

export default {
  schema: './src/common/db/schema',
  out: './drizzle/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: 'postgres://postgres:postgres@localhost:5432/postgres',
  },
} satisfies Config;
