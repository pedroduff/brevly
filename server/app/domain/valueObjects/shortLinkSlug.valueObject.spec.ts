import { describe, it, expect } from 'vitest';
import { ShortLinkSlug } from './shortLinkSlug.valueObject.js';

describe('ShortLinkSlug', () => {
  it('creates slug with alphanumeric 4-16 chars', () => {
    const slug = ShortLinkSlug.create('abc12');
    expect(slug.value).toBe('abc12');
  });

  it('trims whitespace', () => {
    const slug = ShortLinkSlug.create('  xYz9  ');
    expect(slug.value).toBe('xYz9');
  });

  it('throws InvalidSlugFormatError for too short', () => {
    expect(() => ShortLinkSlug.create('ab')).toThrow(
      expect.objectContaining({ name: 'InvalidSlugFormatError' }),
    );
  });

  it('throws InvalidSlugFormatError for invalid chars', () => {
    expect(() => ShortLinkSlug.create('ab-cd')).toThrow(
      expect.objectContaining({ name: 'InvalidSlugFormatError' }),
    );
    expect(() => ShortLinkSlug.create('ab cd')).toThrow(
      expect.objectContaining({ name: 'InvalidSlugFormatError' }),
    );
  });

  it('equals returns true for same value', () => {
    const a = ShortLinkSlug.create('slug1');
    const b = ShortLinkSlug.create('slug1');
    expect(a.equals(b)).toBe(true);
  });
});
