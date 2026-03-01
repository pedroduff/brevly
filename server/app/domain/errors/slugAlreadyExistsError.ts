import { DomainError } from './domainError.js';

export class SlugAlreadyExistsError extends DomainError {
  constructor(slug: string) {
    super(`Slug already exists: ${slug}`);
    this.name = 'SlugAlreadyExistsError';
  }
}
