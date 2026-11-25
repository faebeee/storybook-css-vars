import { DEFAULT_SIZE_UNITS } from '../constants';
import type { CssVarConfig, CssVarSize, CssVarsOverrides, CssVarsParameter } from '../types';

const SIZE = /^\s*(-?(?:\d+\.?\d*|\.\d+))\s*([a-z%]*)\s*$/i;

/** Splits a size like `'1.5rem'` or `16` into number and unit. Returns `undefined` for anything else. */
export function parseSize(
  raw: string | number | undefined,
  config: Pick<CssVarSize, 'unit' | 'units'>,
): { value: number; unit: string } | undefined {
  const fallbackUnit = config.unit ?? (config.units ?? DEFAULT_SIZE_UNITS)[0] ?? '';
  if (raw === undefined || raw === '') return undefined;
  if (typeof raw === 'number') return Number.isNaN(raw) ? undefined : { value: raw, unit: fallbackUnit };
  const match = SIZE.exec(raw);
  if (!match) return undefined;
  return { value: Number(match[1]), unit: match[2] || fallbackUnit };
}

/** Returns the raw (unit-less) value for a variable: the override if present, else the default. */
export function getRawValue(
  name: string,
  config: CssVarConfig,
  overrides: CssVarsOverrides | undefined,
): string | number | undefined {
  const override = overrides?.[name];
  if (override !== undefined && override !== '') return override;
  return config.default;
}

/** Turns a raw value into the string that ends up in `style.setProperty`. */
export function toCssValue(config: CssVarConfig, raw: string | number | undefined): string | undefined {
  if (raw === undefined || raw === '') return undefined;
  if (config.type === 'number') {
    const num = typeof raw === 'number' ? raw : Number(raw);
    if (Number.isNaN(num)) return undefined;
    return `${num}${config.unit ?? ''}`;
  }
  if (config.type === 'size') {
    const size = parseSize(raw, config);
    return size ? `${size.value}${size.unit}` : undefined;
  }
  return String(raw);
}

/**
 * Resolves the final CSS values for all variables a story declares.
 * Variables without override and without default are left out, so the component's CSS fallback applies.
 */
export function resolveCssVars(
  params: CssVarsParameter | undefined,
  overrides: CssVarsOverrides | undefined,
): Record<string, string> {
  const result: Record<string, string> = {};
  if (!params) return result;
  for (const [name, config] of Object.entries(params)) {
    if (!config) continue;
    const value = toCssValue(config, getRawValue(name, config, overrides));
    if (value !== undefined) result[name] = value;
  }
  return result;
}

/** Overrides that differ from the declared default, limited to the variables of the current story. */
export function getChangedVars(
  params: CssVarsParameter | undefined,
  overrides: CssVarsOverrides | undefined,
): string[] {
  if (!params || !overrides) return [];
  return Object.entries(params)
    .filter(([name, config]) => {
      if (!config) return false;
      const override = overrides[name];
      if (override === undefined || override === '') return false;
      // Compare the applied CSS values, so e.g. `16` with unit px equals `'16px'`.
      return toCssValue(config, override) !== toCssValue(config, config.default);
    })
    .map(([name]) => name);
}
