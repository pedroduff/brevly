import { describe, it, expect, vi } from 'vitest';
import { ListShortLinksUseCase } from './listShortLinks.useCase.js';

describe('ListShortLinksUseCase', () => {
  it('returns items with redirectUrl from redirectBaseUrl', async () => {
    const mockShortLink = {
      id: 'id-1',
      slug: { value: 'abc12' },
      originalUrl: { value: 'https://example.com' },
      accessCount: 2,
      createdAt: new Date('2025-01-15T10:00:00.000Z'),
    };
    const list = vi.fn().mockResolvedValue({
      items: [mockShortLink],
      nextCursor: null,
    });
    const useCase = new ListShortLinksUseCase(
      {
        save: vi.fn(),
        findById: vi.fn(),
        findBySlug: vi.fn(),
        delete: vi.fn(),
        list,
        incrementAccessCountBySlug: vi.fn(),
      },
      'https://brev.ly',
    );
    const result = await useCase.execute({ limit: 10 });
    expect(list).toHaveBeenCalledWith({ limit: 10, cursor: undefined });
    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toMatchObject({
      id: 'id-1',
      slug: 'abc12',
      originalUrl: 'https://example.com',
      redirectUrl: 'https://brev.ly/r/abc12',
      accessCount: 2,
    });
    expect(result.items[0].createdAt).toBe('2025-01-15T10:00:00.000Z');
    expect(result.nextCursor).toBeNull();
  });

  it('passes cursor to repository when provided', async () => {
    const list = vi.fn().mockResolvedValue({ items: [], nextCursor: null });
    const useCase = new ListShortLinksUseCase(
      {
        save: vi.fn(),
        findById: vi.fn(),
        findBySlug: vi.fn(),
        delete: vi.fn(),
        list,
        incrementAccessCountBySlug: vi.fn(),
      },
      'https://brev.ly',
    );
    await useCase.execute({ limit: 5, cursor: 'cursor-abc' });
    expect(list).toHaveBeenCalledWith({ limit: 5, cursor: 'cursor-abc' });
  });
});
