export const ADDON_ID = 'storybook-addon-css-vars';
export const PANEL_ID = `${ADDON_ID}/panel`;

/** Key under `parameters` where a story declares its CSS variables. */
export const PARAM_KEY = 'cssVars';

/** Key under `globals` where the user's overrides from the panel are stored. */
export const GLOBAL_KEY = 'cssVars';

/** Values offered by the `position` type, i.e. the keywords of the CSS `position` property. */
export const POSITION_VALUES = ['static', 'relative', 'absolute', 'fixed', 'sticky'] as const;

/** Values offered by the `display` type, i.e. the common keywords of the CSS `display` property. */
export const DISPLAY_VALUES = [
  'block',
  'inline',
  'inline-block',
  'flex',
  'inline-flex',
  'grid',
  'inline-grid',
  'flow-root',
  'contents',
  'list-item',
  'table',
  'none',
] as const;

/** Units offered by the `size` type when the config doesn't set `units`. */
export const DEFAULT_SIZE_UNITS = ['px', 'rem', 'em', '%', 'fr', 'vw', 'vh', 'ch'];
