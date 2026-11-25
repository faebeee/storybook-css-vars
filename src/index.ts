import { definePreviewAddon } from 'storybook/internal/csf';

import addonAnnotations from './preview';

export default () => definePreviewAddon(addonAnnotations);

export { withCssVars } from './withCssVars';
export { PARAM_KEY, GLOBAL_KEY, DEFAULT_SIZE_UNITS, POSITION_VALUES, DISPLAY_VALUES } from './constants';
export type {
  CssVarName,
  CssVarConfig,
  CssVarColor,
  CssVarNumber,
  CssVarSize,
  CssVarPosition,
  CssPosition,
  CssVarDisplay,
  CssDisplay,
  CssVarSelect,
  CssVarText,
  CssVarsParameter,
  CssVarsOverrides,
} from './types';
