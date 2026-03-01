import type { ShortLink } from '../../../../domain/entities/shortLink.entity.js';
import type { CreateShortLinkOutput } from '../dataTransferObjects/createShortLink.dataTransferObject.js';
import type { ShortLinkListItemDTO } from '../dataTransferObjects/listShortLinks.dataTransferObject.js';

export function shortLinkToCreateOutput(shortLink: ShortLink): CreateShortLinkOutput {
  return {
    id: shortLink.id,
    slug: shortLink.slug.value,
    originalUrl: shortLink.originalUrl.value,
    accessCount: shortLink.accessCount,
    createdAt: shortLink.createdAt.toISOString(),
  };
}

export function shortLinkToListItemDTO(
  shortLink: ShortLink,
): Omit<ShortLinkListItemDTO, 'redirectUrl'> {
  return {
    id: shortLink.id,
    slug: shortLink.slug.value,
    originalUrl: shortLink.originalUrl.value,
    accessCount: shortLink.accessCount,
    createdAt: shortLink.createdAt.toISOString(),
  };
}
