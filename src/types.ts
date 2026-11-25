export type CssVarName = `--${string}`;

interface CssVarBase {
  /** Label shown in the panel. Defaults to the variable name. */
  label?: string;
  /** Help text shown below the label. */
  description?: string;
}

export interface CssVarColor extends CssVarBase {
  type: 'color';
  /** Any CSS color, e.g. `#0057ff`, `rgb(0 0 0 / 50%)`, `rebeccapurple`. */
  default?: string;
}

export interface CssVarNumber extends CssVarBase {
  type: 'number';
  default?: number;
  /** Appended to the value when it is applied, e.g. `px`, `rem`, `%`. Leave empty for unitless values. */
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
}

export interface CssVarSize extends CssVarBase {
  type: 'size';
  /**
   * Initial value. Either a number (uses `unit`) or a string with unit, e.g. `'1.5rem'`, `'50%'`.
   */
  default?: number | string;
  /** Unit preselected in the dropdown when `default` has none. Defaults to the first entry of `units`. */
  unit?: string;
  /** Units offered in the dropdown. Defaults to `DEFAULT_SIZE_UNITS`. */
  units?: string[];
  /** With `min` and `max` set, a slider is shown. Applies to the number regardless of the unit. */
  min?: number;
  max?: number;
  step?: number;
}

export interface CssVarSelect extends CssVarBase {
  type: 'select';
  /**
   * Allowed values. Either a list of values, or an object mapping a label to a value,
   * e.g. `{ Primary: 'var(--color-primary)', Danger: 'var(--color-danger)' }`.
   */
  options: string[] | Record<string, string>;
  default?: string;
}

export interface CssVarText extends CssVarBase {
  type: 'text';
  /** Any CSS value, e.g. `0 1px 2px rgb(0 0 0 / 20%)`. */
  default?: string;
}

export type CssVarConfig = CssVarColor | CssVarNumber | CssVarSize | CssVarSelect | CssVarText;

/** Value of `parameters.cssVars`. */
export type CssVarsParameter = Partial<Record<CssVarName, CssVarConfig>>;

/** Value of `globals.cssVars`: the raw values the user entered in the panel. */
export type CssVarsOverrides = Record<string, string | number>;
