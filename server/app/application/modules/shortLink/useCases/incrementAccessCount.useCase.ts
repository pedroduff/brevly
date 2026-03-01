import type { ShortLinkRepository } from '../../../../domain/repositories/shortLink.repository.js';

export class IncrementAccessCountUseCase {
  constructor(private readonly shortLinkRepository: ShortLinkRepository) {}

  async execute(slug: string): Promise<void> {
    await this.shortLinkRepository.incrementAccessCountBySlug(slug);
  }
}
