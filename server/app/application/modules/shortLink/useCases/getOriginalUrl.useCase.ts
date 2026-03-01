import type { ShortLinkRepository } from '../../../../domain/repositories/shortLink.repository.js';

export interface GetOriginalUrlResult {
  originalUrl: string;
}

export class GetOriginalUrlUseCase {
  constructor(private readonly shortLinkRepository: ShortLinkRepository) {}

  async execute(slug: string): Promise<GetOriginalUrlResult | null> {
    const shortLink = await this.shortLinkRepository.findBySlug(slug);
    if (!shortLink) return null;
    return { originalUrl: shortLink.originalUrl.value };
  }
}
