import { describe, it, expect, vi } from 'vitest';
import { GetOriginalUrlUseCase } from './getOriginalUrl.useCase.js';

describe('GetOriginalUrlUseCase', () => {
  it('returns originalUrl when slug exists', async () => {
    const shortLink = {
      id: '1',
      slug: { value: 'abc12' },
      originalUrl: { value: 'https://example.com/page' },
      accessCount: 0,
      createdAt: new Date(),
    };
    const useCase = new GetOriginalUrlUseCase({
      save: vi.fn(),
      findById: vi.fn(),
      findBySlug: vi.fn().mockResolvedValue(shortLink),
      delete: vi.fn(),
      list: vi.fn(),
      incrementAccessCountBySlug: vi.fn(),
    });
    const result = await useCase.execute('abc12');
    expect(result).toEqual({ originalUrl: 'https://example.com/page' });
  });

  it('returns null when slug does not exist', async () => {
    const useCase = new GetOriginalUrlUseCase({
      save: vi.fn(),
      findById: vi.fn(),
      findBySlug: vi.fn().mockResolvedValue(null),
      delete: vi.fn(),
      list: vi.fn(),
      incrementAccessCountBySlug: vi.fn(),
    });
    const result = await useCase.execute('nonexistent');
    expect(result).toBeNull();
  });
});
