import { InvalidSlugFormatError } from '../errors/invalidSlugFormatError.js';

const SLUG_REGEX = /^[a-zA-Z0-9]{4,16}$/;

export class ShortLinkSlug {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): ShortLinkSlug {
    const trimmed = value.trim();
    if (!trimmed || !SLUG_REGEX.test(trimmed)) {
      throw new InvalidSlugFormatError(value);
    }
    return new ShortLinkSlug(trimmed);
  }

  get value(): string {
    return this._value;
  }

  equals(other: ShortLinkSlug): boolean {
    return this._value === other._value;
  }
}
