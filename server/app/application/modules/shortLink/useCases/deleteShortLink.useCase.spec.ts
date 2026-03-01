import { describe, it, expect, vi } from 'vitest';
import { DeleteShortLinkUseCase } from './deleteShortLink.useCase.js';

describe('DeleteShortLinkUseCase', () => {
  it('calls repository delete with the given id', async () => {
    const deleteFn = vi.fn().mockResolvedValue(undefined);
    const useCase = new DeleteShortLinkUseCase({
      save: vi.fn(),
      findById: vi.fn(),
      findBySlug: vi.fn(),
      delete: deleteFn,
      list: vi.fn(),
      incrementAccessCountBySlug: vi.fn(),
    });
    await useCase.execute('id-123');
    expect(deleteFn).toHaveBeenCalledOnce();
    expect(deleteFn).toHaveBeenCalledWith('id-123');
  });
});
