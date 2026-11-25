import { describe, expect, it } from 'vitest';

import { decodeOverrides, decodeValue, encodeOverrides, encodeValue } from './overrides';

describe('URL-safe override encoding', () => {
  it('keeps simple values readable', () => {
    expect(encodeValue('#ff0066')).toBe('#ff0066');
    expect(encodeValue('700')).toBe('700');
    expect(encodeValue('bold')).toBe('bold');
    expect(encodeValue(1.5)).toBe(1.5);
  });

  it.each(['0 4px 12px rgba(0,0,0,.4)', 'var(--color-primary)', 'rgb(0 0 0 / 50%)', '"Grüezi" sans-serif', 'b64_x'])(
    'round-trips %s through a URL-safe string',
    (value) => {
      const encoded = encodeValue(value) as string;
      expect(encoded).toMatch(/^[a-zA-Z0-9 _-]*$/);
      expect(decodeValue(encoded)).toBe(value);
    },
  );

  it('encodes and decodes whole override objects', () => {
    const overrides = { '--a': 'var(--b)', '--c': 3 };
    expect(decodeOverrides(encodeOverrides(overrides))).toEqual(overrides);
  });

  it('ignores invalid stored globals', () => {
    expect(decodeOverrides(undefined)).toEqual({});
    expect(decodeOverrides({ '--a': { nested: true } })).toEqual({});
  });
});
