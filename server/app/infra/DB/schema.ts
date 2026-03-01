import { pgTable, varchar, integer, timestamp, uuid } from 'drizzle-orm/pg-core';

export const shortLinksTable = pgTable('short_links', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 32 }).notNull().unique(),
  originalUrl: varchar('original_url', { length: 2048 }).notNull(),
  accessCount: integer('access_count').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export type ShortLinkRow = typeof shortLinksTable.$inferSelect;
