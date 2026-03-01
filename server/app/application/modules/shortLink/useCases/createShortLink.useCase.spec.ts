import { describe, it, expect, vi } from 'vitest';
import { CreateShortLinkUseCase } from './createShortLink.useCase.js';

describe('CreateShortLinkUseCase', () => {
  it('saves and returns short link', async () => {
    const save = vi.fn();
    const findBySlug = vi.fn().mockResolvedValue(null);
    const useCase = new CreateShortLinkUseCase({
      save,
      findById: vi.fn(),
      findBySlug,
      delete: vi.fn(),
      list: vi.fn(),
      incrementAccessCountBySlug: vi.fn(),
    });
    const result = await useCase.execute({
      slug: 'abc12',
      originalUrl: 'https://example.com',
    });
    expect(result.slug).toBe('abc12');
    expect(result.originalUrl).toBe('https://example.com');
    expect(result.accessCount).toBe(0);
    expect(save).toHaveBeenCalledOnce();
  });

  it('throws SlugAlreadyExistsError when slug exists', async () => {
    const shortLink = { id: '1', slug: { value: 'abc12' }, originalUrl: { value: 'https://x.com' }, accessCount: 0, createdAt: new Date() };
    const useCase = new CreateShortLinkUseCase({
      save: vi.fn(),
      findById: vi.fn(),
      findBySlug: vi.fn().mockResolvedValue(shortLink),
      delete: vi.fn(),
      list: vi.fn(),
      incrementAccessCountBySlug: vi.fn(),
    });
    await expect(
      useCase.execute({ slug: 'abc12', originalUrl: 'https://other.com' }),
    ).rejects.toThrow(
      expect.objectContaining({ name: 'SlugAlreadyExistsError' }),
    );
  });
});
