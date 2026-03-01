import { describe, it, expect } from 'vitest';
import { OriginalUrl } from './originalUrl.valueObject.js';
import { DomainError } from '../errors/domainError.js';

describe('OriginalUrl', () => {
  it('creates valid URL', () => {
    const url = OriginalUrl.create('https://example.com/path');
    expect(url.value).toBe('https://example.com/path');
  });

  it('trims whitespace', () => {
    const url = OriginalUrl.create('  https://a.com  ');
    expect(url.value).toBe('https://a.com');
  });

  it('throws DomainError for invalid URL', () => {
    expect(() => OriginalUrl.create('not-a-url')).toThrow(DomainError);
  });

  it('equals returns true for same value', () => {
    const a = OriginalUrl.create('https://x.com');
    const b = OriginalUrl.create('https://x.com');
    expect(a.equals(b)).toBe(true);
  });
});
