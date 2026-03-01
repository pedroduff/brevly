import { randomUUID } from 'node:crypto';
import { ShortLink } from '../../../../domain/entities/shortLink.entity.js';
import { ShortLinkSlug } from '../../../../domain/valueObjects/shortLinkSlug.valueObject.js';
import { OriginalUrl } from '../../../../domain/valueObjects/originalUrl.valueObject.js';
import type { ShortLinkRepository } from '../../../../domain/repositories/shortLink.repository.js';
import { SlugAlreadyExistsError } from '../../../../domain/errors/slugAlreadyExistsError.js';
import type { CreateShortLinkInput, CreateShortLinkOutput } from '../dataTransferObjects/createShortLink.dataTransferObject.js';
import { shortLinkToCreateOutput } from '../mappers/shortLink.mapper.js';

export class CreateShortLinkUseCase {
  constructor(private readonly shortLinkRepository: ShortLinkRepository) {}

  async execute(input: CreateShortLinkInput): Promise<CreateShortLinkOutput> {
    const slug = ShortLinkSlug.create(input.slug);
    const existing = await this.shortLinkRepository.findBySlug(slug.value);
    if (existing) {
      throw new SlugAlreadyExistsError(slug.value);
    }
    const originalUrl = OriginalUrl.create(input.originalUrl);
    const shortLink = new ShortLink(randomUUID(), {
      slug,
      originalUrl,
      accessCount: 0,
      createdAt: new Date(),
    });
    await this.shortLinkRepository.save(shortLink);
    return shortLinkToCreateOutput(shortLink);
  }
}
