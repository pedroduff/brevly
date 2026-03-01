import { describe, it, expect, vi } from 'vitest';
import { IncrementAccessCountUseCase } from './incrementAccessCount.useCase.js';

describe('IncrementAccessCountUseCase', () => {
  it('calls repository incrementAccessCountBySlug with the given slug', async () => {
    const incrementAccessCountBySlug = vi.fn().mockResolvedValue(undefined);
    const useCase = new IncrementAccessCountUseCase({
      save: vi.fn(),
      findById: vi.fn(),
      findBySlug: vi.fn(),
      delete: vi.fn(),
      list: vi.fn(),
      incrementAccessCountBySlug,
    });
    await useCase.execute('myslug');
    expect(incrementAccessCountBySlug).toHaveBeenCalledOnce();
    expect(incrementAccessCountBySlug).toHaveBeenCalledWith('myslug');
  });
});
