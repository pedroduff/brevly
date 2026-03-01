import { DomainError } from '../errors/domainError.js';

export class OriginalUrl {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): OriginalUrl {
    const trimmed = value.trim();
    try {
      new URL(trimmed);
    } catch {
      throw new DomainError(`Invalid URL: ${value}`);
    }
    return new OriginalUrl(trimmed);
  }

  get value(): string {
    return this._value;
  }

  equals(other: OriginalUrl): boolean {
    return this._value === other._value;
  }
}
