import { definePreviewAddon } from 'storybook/internal/csf';

import addonAnnotations from './preview';

export default () => definePreviewAddon(addonAnnotations);

export { withCssVars } from './withCssVars';
export { PARAM_KEY, GLOBAL_KEY, DEFAULT_SIZE_UNITS } from './constants';
export type {
  CssVarName,
  CssVarConfig,
  CssVarColor,
  CssVarNumber,
  CssVarSize,
  CssVarSelect,
  CssVarText,
  CssVarsParameter,
  CssVarsOverrides,
} from './types';
