import { describe, expect, it } from 'vitest';

import type { CssVarsParameter } from '../types';
import { buildChangedCss } from './exportCss';
import { groupVars } from './groupVars';

const params: CssVarsParameter = {
  '--bg': { type: 'color', group: 'Colors' },
  '--radius': { type: 'number', unit: 'px' },
  '--pad': { type: 'size', group: 'Spacing' },
  '--fg': { type: 'color', group: 'Colors' },
  '--weight': { type: 'select', options: ['400'], group: '  ' },
};

describe('groupVars', () => {
  it('puts ungrouped vars first, then groups in order of first appearance', () => {
    expect(groupVars(params).map((g) => [g.label, g.vars.map(([n]) => n)])).toEqual([
      [undefined, ['--radius', '--weight']],
      ['Colors', ['--bg', '--fg']],
      ['Spacing', ['--pad']],
    ]);
  });

  it('returns no groups without parameters', () => {
    expect(groupVars(undefined)).toEqual([]);
  });
});

describe('buildChangedCss with groups', () => {
  it('follows the panel order and adds a comment per group', () => {
    expect(buildChangedCss(params, { '--fg': 'red', '--pad': '2rem', '--radius': 3, '--bg': 'blue' })).toBe(
      ':root {\n  --radius: 3px;\n\n  /* Colors */\n  --bg: blue;\n  --fg: red;\n\n  /* Spacing */\n  --pad: 2rem;\n}\n',
    );
  });

  it('leaves out groups without changes', () => {
    expect(buildChangedCss(params, { '--pad': '1px' })).toBe(':root {\n  /* Spacing */\n  --pad: 1px;\n}\n');
  });
});
