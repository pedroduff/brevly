export interface ListShortLinksInputDTO {
  limit: number;
  cursor?: string;
}

export interface ShortLinkListItemDTO {
  id: string;
  slug: string;
  originalUrl: string;
  redirectUrl: string;
  accessCount: number;
  createdAt: string;
}

export interface ListShortLinksOutputDTO {
  items: ShortLinkListItemDTO[];
  nextCursor: string | null;
}
