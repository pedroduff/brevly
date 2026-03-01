export interface CreateShortLinkInput {
  slug: string;
  originalUrl: string;
}

export interface CreateShortLinkOutput {
  id: string;
  slug: string;
  originalUrl: string;
  accessCount: number;
  createdAt: string;
}
