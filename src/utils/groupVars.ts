import type { CssVarConfig, CssVarsParameter } from '../types';

export interface CssVarGroup {
  /** Group label, `undefined` for variables without `group`. */
  label: string | undefined;
  vars: [name: string, config: CssVarConfig][];
}

/**
 * Groups the declared variables by their `group` field.
 * Ungrouped variables come first, then the groups in the order they first appear.
 * Within a group, variables keep their declaration order.
 */
export function groupVars(params: CssVarsParameter | undefined): CssVarGroup[] {
  const ungrouped: CssVarGroup = { label: undefined, vars: [] };
  const groups = new Map<string, CssVarGroup>();
  for (const [name, config] of Object.entries(params ?? {})) {
    if (!config) continue;
    const label = config.group?.trim();
    if (!label) {
      ungrouped.vars.push([name, config]);
      continue;
    }
    if (!groups.has(label)) groups.set(label, { label, vars: [] });
    groups.get(label)!.vars.push([name, config]);
  }
  return [ungrouped, ...groups.values()].filter((g) => g.vars.length > 0);
}
