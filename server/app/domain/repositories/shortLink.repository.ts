import type { ShortLink } from '../entities/shortLink.entity.js';

export interface ListShortLinksInput {
  limit: number;
  cursor?: string;
}

export interface ListShortLinksResult {
  items: ShortLink[];
  nextCursor: string | null;
}

export interface ShortLinkRepository {
  save(shortLink: ShortLink): Promise<void>;
  findById(id: string): Promise<ShortLink | null>;
  findBySlug(slug: string): Promise<ShortLink | null>;
  delete(id: string): Promise<void>;
  list(input: ListShortLinksInput): Promise<ListShortLinksResult>;
  incrementAccessCountBySlug(slug: string): Promise<void>;
}
