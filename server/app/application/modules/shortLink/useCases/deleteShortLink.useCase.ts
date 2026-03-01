import type { ShortLinkRepository } from '../../../../domain/repositories/shortLink.repository.js';

export class DeleteShortLinkUseCase {
  constructor(private readonly shortLinkRepository: ShortLinkRepository) {}

  async execute(id: string): Promise<void> {
    await this.shortLinkRepository.delete(id);
  }
}
