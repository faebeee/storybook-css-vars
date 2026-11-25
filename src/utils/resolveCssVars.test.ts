import { describe, expect, it } from 'vitest';

import type { CssVarsParameter } from '../types';
import { getChangedVars, parseSize, resolveCssVars } from './resolveCssVars';

const params: CssVarsParameter = {
  '--bg': { type: 'color', default: '#fff' },
  '--fg': { type: 'color' },
  '--radius': { type: 'number', default: 4, unit: 'px' },
  '--scale': { type: 'number', default: 1 },
  '--weight': { type: 'select', options: ['400', '700'], default: '400' },
};

describe('resolveCssVars', () => {
  it('uses defaults and appends units', () => {
    expect(resolveCssVars(params, {})).toEqual({
      '--bg': '#fff',
      '--radius': '4px',
      '--scale': '1',
      '--weight': '400',
    });
  });

  it('applies overrides, including numbers that came back from the URL as strings', () => {
    expect(resolveCssVars(params, { '--bg': 'red', '--radius': '12', '--fg': '#000' })).toMatchObject({
      '--bg': 'red',
      '--fg': '#000',
      '--radius': '12px',
    });
  });

  it('ignores overrides for variables the story does not declare', () => {
    expect(resolveCssVars(params, { '--other': 'x' })).not.toHaveProperty('--other');
  });

  it('falls back to the default for empty overrides and drops invalid numbers', () => {
    expect(resolveCssVars(params, { '--bg': '', '--radius': 'abc' })).toMatchObject({ '--bg': '#fff' });
    expect(resolveCssVars(params, { '--radius': 'abc' })).not.toHaveProperty('--radius');
  });

  it('returns nothing without parameters', () => {
    expect(resolveCssVars(undefined, { '--bg': 'red' })).toEqual({});
  });
});

describe('size type', () => {
  const sizeParams: CssVarsParameter = {
    '--gap': { type: 'size', default: 16 },
    '--col': { type: 'size', default: '1fr', units: ['fr', '%'] },
    '--w': { type: 'size', unit: 'rem' },
  };

  it('parses numbers and strings with units', () => {
    expect(parseSize('1.5rem', {})).toEqual({ value: 1.5, unit: 'rem' });
    expect(parseSize('50%', {})).toEqual({ value: 50, unit: '%' });
    expect(parseSize('-.5em', {})).toEqual({ value: -0.5, unit: 'em' });
    expect(parseSize(12, { unit: 'vh' })).toEqual({ value: 12, unit: 'vh' });
    expect(parseSize('12', { units: ['fr'] })).toEqual({ value: 12, unit: 'fr' });
    expect(parseSize('auto', {})).toBeUndefined();
  });

  it('resolves defaults with the fallback unit and applies overrides', () => {
    expect(resolveCssVars(sizeParams, {})).toEqual({ '--gap': '16px', '--col': '1fr' });
    expect(resolveCssVars(sizeParams, { '--gap': '2rem', '--col': '30%', '--w': 10 })).toEqual({
      '--gap': '2rem',
      '--col': '30%',
      '--w': '10rem',
    });
  });

  it('treats a number default and the same value with unit as unchanged', () => {
    expect(getChangedVars(sizeParams, { '--gap': '16px', '--col': '2fr' })).toEqual(['--col']);
  });
});

describe('getChangedVars', () => {
  it('lists only declared vars that differ from their default', () => {
    expect(getChangedVars(params, { '--bg': '#fff', '--radius': 8, '--other': 'x', '--fg': 'blue' }).sort()).toEqual([
      '--fg',
      '--radius',
    ]);
  });
});
