import type { CssVarsOverrides, CssVarsParameter } from '../types';
import { groupVars } from './groupVars';
import { getChangedVars, toCssValue } from './resolveCssVars';

/**
 * Builds a CSS rule with only the variables that were changed in the panel,
 * in the same order as the panel. Grouped variables get a comment with the group label.
 */
export function buildChangedCss(
  params: CssVarsParameter | undefined,
  overrides: CssVarsOverrides | undefined,
  selector = ':root',
): string {
  const changed = new Set(getChangedVars(params, overrides));
  const blocks = groupVars(params).flatMap((group) => {
    const lines = group.vars.flatMap(([name, config]) => {
      if (!changed.has(name)) return [];
      const value = toCssValue(config, overrides?.[name]);
      return value === undefined ? [] : [`  ${name}: ${value};`];
    });
    if (lines.length === 0) return [];
    return [group.label ? [`  /* ${group.label.replace(/\*\//g, '* /')} */`, ...lines].join('\n') : lines.join('\n')];
  });
  if (blocks.length === 0) return '';
  return `${selector.trim() || ':root'} {\n${blocks.join('\n\n')}\n}\n`;
}
