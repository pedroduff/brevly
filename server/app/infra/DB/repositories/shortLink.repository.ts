import { eq, desc, lt, sql } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { ShortLink } from '../../../domain/entities/shortLink.entity.js';
import { ShortLinkSlug } from '../../../domain/valueObjects/shortLinkSlug.valueObject.js';
import { OriginalUrl } from '../../../domain/valueObjects/originalUrl.valueObject.js';
import type { ShortLinkRepository as IShortLinkRepository } from '../../../domain/repositories/shortLink.repository.js';
import { shortLinksTable, type ShortLinkRow } from '../schema.js';

function rowToEntity(row: ShortLinkRow): ShortLink {
  return new ShortLink(row.id, {
    slug: ShortLinkSlug.create(row.slug),
    originalUrl: OriginalUrl.create(row.originalUrl),
    accessCount: row.accessCount,
    createdAt: new Date(row.createdAt),
  });
}

function entityToRow(shortLink: ShortLink): Omit<ShortLinkRow, 'createdAt'> & { createdAt?: Date } {
  return {
    id: shortLink.id,
    slug: shortLink.slug.value,
    originalUrl: shortLink.originalUrl.value,
    accessCount: shortLink.accessCount,
    createdAt: shortLink.createdAt,
  };
}

export function createShortLinkRepository(
  db: NodePgDatabase<Record<string, never>>,
): IShortLinkRepository {
  return {
    async save(shortLink) {
      const row = entityToRow(shortLink);
      await db.insert(shortLinksTable).values({
        id: row.id,
        slug: row.slug,
        originalUrl: row.originalUrl,
        accessCount: row.accessCount,
        createdAt: row.createdAt ?? new Date(),
      });
    },

    async findById(id) {
      const rows = await db.select().from(shortLinksTable).where(eq(shortLinksTable.id, id)).limit(1);
      const row = rows.at(0);
      return row ? rowToEntity(row) : null;
    },

    async findBySlug(slug) {
      const rows = await db
        .select()
        .from(shortLinksTable)
        .where(eq(shortLinksTable.slug, slug))
        .limit(1);
      const row = rows.at(0);
      return row ? rowToEntity(row) : null;
    },

    async delete(id) {
      await db.delete(shortLinksTable).where(eq(shortLinksTable.id, id));
    },

    async incrementAccessCountBySlug(slug) {
      await db
        .update(shortLinksTable)
        .set({
          accessCount: sql`${shortLinksTable.accessCount} + 1`,
        })
        .where(eq(shortLinksTable.slug, slug));
    },

    async list(input) {
      const limit = Math.min(input.limit, 100);
      const orderBy = desc(shortLinksTable.createdAt);

      let rows: ShortLinkRow[];
      if (input.cursor) {
        const cursorRow = await db
          .select({ createdAt: shortLinksTable.createdAt })
          .from(shortLinksTable)
          .where(eq(shortLinksTable.id, input.cursor))
          .limit(1);
        const cursorVal = cursorRow.at(0)?.createdAt;
        if (!cursorVal) {
          return { items: [], nextCursor: null };
        }
        rows = await db
          .select()
          .from(shortLinksTable)
          .where(lt(shortLinksTable.createdAt, cursorVal))
          .orderBy(orderBy)
          .limit(limit + 1);
      } else {
        rows = await db
          .select()
          .from(shortLinksTable)
          .orderBy(orderBy)
          .limit(limit + 1);
      }

      const hasMore = rows.length > limit;
      const items = rows.slice(0, limit).map(rowToEntity);
      const nextCursor = hasMore && items.length > 0 ? items.at(-1)?.id ?? null : null;

      return { items, nextCursor };
    },
  };
}
