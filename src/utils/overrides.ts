import type { CssVarsOverrides } from '../types';

/**
 * Storybook only writes a global to the URL if every value in it passes these checks
 * (see `validateArgs` in storybook/router). A single "unsafe" value, e.g. a box-shadow
 * with dots and parentheses, would drop the whole `cssVars` global from the URL.
 * Such values are therefore stored base64url-encoded, which only uses safe characters.
 */
const SAFE = /^[a-zA-Z0-9 _-]*$/;
const NUMBER = /^-?[0-9]+(\.[0-9]+)?$/;
const HEX = /^#([a-f0-9]{3,4}|[a-f0-9]{6}|[a-f0-9]{8})$/i;
const PREFIX = 'b64_';

const isUrlSafe = (value: string) => SAFE.test(value) || NUMBER.test(value) || HEX.test(value);

function toBase64Url(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(value: string): string {
  const b64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4));
  return new TextDecoder().decode(Uint8Array.from(binary, (c) => c.charCodeAt(0)));
}

export function encodeValue(value: string | number): string | number {
  if (typeof value === 'number') return value;
  if (isUrlSafe(value) && !value.startsWith(PREFIX)) return value;
  return PREFIX + toBase64Url(value);
}

export function decodeValue(value: string | number): string | number {
  if (typeof value !== 'string' || !value.startsWith(PREFIX)) return value;
  try {
    return fromBase64Url(value.slice(PREFIX.length));
  } catch {
    return value;
  }
}

/** Reads `globals.cssVars` into plain values. */
export function decodeOverrides(stored: unknown): CssVarsOverrides {
  if (!stored || typeof stored !== 'object') return {};
  const result: CssVarsOverrides = {};
  for (const [name, value] of Object.entries(stored as Record<string, unknown>)) {
    if (typeof value === 'string' || typeof value === 'number') result[name] = decodeValue(value);
  }
  return result;
}

/** Turns plain values into what is stored in `globals.cssVars`. */
export function encodeOverrides(overrides: CssVarsOverrides): CssVarsOverrides {
  const result: CssVarsOverrides = {};
  for (const [name, value] of Object.entries(overrides)) result[name] = encodeValue(value);
  return result;
}
