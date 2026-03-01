import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './app/infra/DB/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? 'postgresql://app:app@localhost:5432/app',
  },
});
