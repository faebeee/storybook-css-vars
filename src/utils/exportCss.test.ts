import { describe, expect, it } from 'vitest';

import type { CssVarsParameter } from '../types';
import { buildChangedCss } from './exportCss';

const params: CssVarsParameter = {
  '--bg': { type: 'color', default: '#fff' },
  '--radius': { type: 'number', default: 4, unit: 'px' },
  '--gap': { type: 'size', default: '1rem' },
  '--shadow': { type: 'text' },
};

describe('buildChangedCss', () => {
  it('exports only changed vars with resolved values, in declaration order', () => {
    expect(
      buildChangedCss(params, {
        '--gap': '2rem',
        '--radius': 4,
        '--bg': 'red',
        '--shadow': '0 1px 2px #000',
        '--x': '1',
      }),
    ).toBe(':root {\n  --bg: red;\n  --gap: 2rem;\n  --shadow: 0 1px 2px #000;\n}\n');
  });

  it('uses a custom selector', () => {
    expect(buildChangedCss(params, { '--radius': 8 }, '.theme-dark')).toBe('.theme-dark {\n  --radius: 8px;\n}\n');
  });

  it('falls back to :root for an empty selector', () => {
    expect(buildChangedCss(params, { '--radius': 8 }, '  ')).toBe(':root {\n  --radius: 8px;\n}\n');
  });

  it('returns an empty string when nothing changed', () => {
    expect(buildChangedCss(params, { '--bg': '#fff' })).toBe('');
    expect(buildChangedCss(undefined, { '--bg': 'red' })).toBe('');
  });
});
