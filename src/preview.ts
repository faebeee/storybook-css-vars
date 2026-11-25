import type { ProjectAnnotations, Renderer } from 'storybook/internal/types';

import { GLOBAL_KEY } from './constants';
import { withCssVars } from './withCssVars';

const preview: ProjectAnnotations<Renderer> = {
  decorators: [withCssVars],
  initialGlobals: {
    [GLOBAL_KEY]: {},
  },
};

export default preview;
