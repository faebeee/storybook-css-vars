import type { CssVarsOverrides, CssVarsParameter } from '../types';
import { getChangedVars, toCssValue } from './resolveCssVars';

/**
 * Builds a CSS rule with only the variables that were changed in the panel,
 * in the order they are declared in the story's `cssVars` parameter.
 */
export function buildChangedCss(
  params: CssVarsParameter | undefined,
  overrides: CssVarsOverrides | undefined,
  selector = ':root',
): string {
  const lines = getChangedVars(params, overrides).flatMap((name) => {
    const config = params?.[name as keyof CssVarsParameter];
    const value = config ? toCssValue(config, overrides?.[name]) : undefined;
    return value === undefined ? [] : [`  ${name}: ${value};`];
  });
  if (lines.length === 0) return '';
  return `${selector.trim() || ':root'} {\n${lines.join('\n')}\n}\n`;
}
