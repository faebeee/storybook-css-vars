export const ADDON_ID = 'storybook-addon-css-vars';
export const PANEL_ID = `${ADDON_ID}/panel`;

/** Key under `parameters` where a story declares its CSS variables. */
export const PARAM_KEY = 'cssVars';

/** Key under `globals` where the user's overrides from the panel are stored. */
export const GLOBAL_KEY = 'cssVars';

/** Units offered by the `size` type when the config doesn't set `units`. */
export const DEFAULT_SIZE_UNITS = ['px', 'rem', 'em', '%', 'fr', 'vw', 'vh', 'ch'];
