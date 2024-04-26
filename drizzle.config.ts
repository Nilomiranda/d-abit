import type { Config } from 'drizzle-kit';
import './src/config/envConfig';

const config = {
  schema: './src/database/schema.ts',
  out: './drizzle',
  driver: 'turso', // 'pg' | 'mysql2' | 'better-sqlite' | 'libsql' | 'turso'
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN!,
  },
} satisfies Config;

export default config