import { DomainError } from './domainError.js';

export class InvalidSlugFormatError extends DomainError {
  constructor(slug: string) {
    super(`Invalid slug format: ${slug}`);
    this.name = 'InvalidSlugFormatError';
  }
}
