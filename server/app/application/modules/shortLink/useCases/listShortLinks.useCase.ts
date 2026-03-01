import type { ShortLinkRepository } from '../../../../domain/repositories/shortLink.repository.js';
import type {
  ListShortLinksInputDTO,
  ListShortLinksOutputDTO,
} from '../dataTransferObjects/listShortLinks.dataTransferObject.js';
import { shortLinkToListItemDTO } from '../mappers/shortLink.mapper.js';

export class ListShortLinksUseCase {
  constructor(
    private readonly shortLinkRepository: ShortLinkRepository,
    private readonly redirectBaseUrl: string,
  ) {}

  async execute(input: ListShortLinksInputDTO): Promise<ListShortLinksOutputDTO> {
    const result = await this.shortLinkRepository.list({
      limit: input.limit,
      cursor: input.cursor,
    });
    const base = this.redirectBaseUrl.replace(/\/$/, '');
    return {
      items: result.items.map((link) => ({
        ...shortLinkToListItemDTO(link),
        redirectUrl: `${base}/r/${link.slug.value}`,
      })),
      nextCursor: result.nextCursor,
    };
  }
}
