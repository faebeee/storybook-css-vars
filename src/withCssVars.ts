import { useEffect } from 'storybook/preview-api';
import type { DecoratorFunction } from 'storybook/internal/types';

import { GLOBAL_KEY, PARAM_KEY } from './constants';
import type { CssVarsParameter } from './types';
import { decodeOverrides } from './utils/overrides';
import { resolveCssVars } from './utils/resolveCssVars';

/**
 * Remembers which variables were set on which element and by which story.
 * In story mode the same root element is reused across stories, so this lets us
 * remove stale variables no matter in which order teardown and render happen.
 */
const applied = new WeakMap<HTMLElement, { storyId: string; names: Set<string> }>();

function clear(el: HTMLElement) {
  const entry = applied.get(el);
  if (!entry) return;
  entry.names.forEach((name) => el.style.removeProperty(name));
  applied.delete(el);
}

export const withCssVars: DecoratorFunction = (storyFn, context) => {
  const el = context.canvasElement as HTMLElement | undefined;
  const params = context.parameters[PARAM_KEY] as CssVarsParameter | undefined;
  const overrides = decodeOverrides(context.globals[GLOBAL_KEY]);
  const storyId = context.id;

  // Applied synchronously (not in an effect) so the first paint already uses the values.
  if (el?.style) {
    const values = resolveCssVars(params, overrides);
    const prev = applied.get(el);
    if (prev) {
      prev.names.forEach((name) => {
        if (prev.storyId !== storyId || !(name in values)) el.style.removeProperty(name);
      });
    }
    Object.entries(values).forEach(([name, value]) => el.style.setProperty(name, value));
    if (Object.keys(values).length > 0) {
      applied.set(el, { storyId, names: new Set(Object.keys(values)) });
    } else {
      applied.delete(el);
    }
  }

  // Remove this story's variables when it is torn down.
  useEffect(
    () => () => {
      if (el && applied.get(el)?.storyId === storyId) clear(el);
    },
    [el, storyId],
  );

  return storyFn();
};
