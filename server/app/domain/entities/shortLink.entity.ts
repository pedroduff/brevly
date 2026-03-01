import { Entity } from '../types/entity.js';
import type { ShortLinkSlug } from '../valueObjects/shortLinkSlug.valueObject.js';
import type { OriginalUrl } from '../valueObjects/originalUrl.valueObject.js';

export interface ShortLinkProps {
  slug: ShortLinkSlug;
  originalUrl: OriginalUrl;
  accessCount: number;
  createdAt: Date;
}

export class ShortLink extends Entity<ShortLinkProps> {
  get slug(): ShortLinkSlug {
    return this.props.slug;
  }

  get originalUrl(): OriginalUrl {
    return this.props.originalUrl;
  }

  get accessCount(): number {
    return this.props.accessCount;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  incrementAccessCount(): ShortLink {
    return new ShortLink(this.id, {
      ...this.props,
      accessCount: this.props.accessCount + 1,
    });
  }
}
