import React from 'react';
import { addons, types, useGlobals, useParameter } from 'storybook/manager-api';

import { Panel } from './components/Panel';
import { ADDON_ID, GLOBAL_KEY, PANEL_ID, PARAM_KEY } from './constants';
import type { CssVarsParameter } from './types';
import { decodeOverrides } from './utils/overrides';
import { getChangedVars } from './utils/resolveCssVars';

const Title = () => {
  const params = useParameter<CssVarsParameter>(PARAM_KEY, {});
  const [globals] = useGlobals();
  const total = Object.keys(params).length;
  const changed = getChangedVars(params, decodeOverrides(globals[GLOBAL_KEY])).length;
  if (!total) return <>CSS Variables</>;
  return <>CSS Variables ({changed ? `${changed}/${total}` : total})</>;
};

addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: Title,
    match: ({ viewMode }) => viewMode === 'story',
    render: ({ active }) => <Panel active={active} />,
  });
});
