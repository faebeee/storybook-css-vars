import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import type { CssVarsParameter } from '../types';
import { Button } from './Button';

const cssVars: CssVarsParameter = {
  '--btn-radius': { type: 'number', default: 24, unit: 'px', min: 0, max: 48, step: 1, label: 'Radius' },

  '--btn-bg': { type: 'color', default: '#1ea7fd', label: 'Background', group: 'Colors' },
  '--btn-fg': {
    type: 'color',
    label: 'Text color',
    description: 'Leave empty to use the CSS fallback',
    group: 'Colors',
  },

  '--btn-padding-x': {
    type: 'size',
    default: '1.25rem',
    units: ['px', 'rem', 'em'],
    label: 'Padding X',
    group: 'Spacing',
  },
  '--btn-min-width': {
    type: 'size',
    label: 'Min width',
    description: 'Size with the full unit list. Empty means no min width.',
    group: 'Spacing',
  },

  '--btn-display': { type: 'display', default: 'inline-block', label: 'Display', group: 'Layout' },
  '--btn-position': { type: 'position', default: 'static', label: 'Position', group: 'Layout' },
  '--btn-offset': {
    type: 'size',
    default: '0px',
    label: 'Offset',
    description: 'top/left, takes effect with relative, absolute, fixed or sticky',
    group: 'Layout',
  },

  '--btn-weight': {
    type: 'select',
    default: '700',
    options: ['400', '500', '700', '900'],
    label: 'Font weight',
    group: 'Typography & effects',
  },
  '--btn-shadow': {
    type: 'text',
    default: 'none',
    label: 'Shadow',
    description: 'Any box-shadow value',
    group: 'Typography & effects',
  },
};

const meta = {
  title: 'Example/Button',
  component: Button,
  args: { onClick: fn(), label: 'Button' },
  tags: ['autodocs'],
  parameters: { cssVars },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { primary: true },
};

export const Secondary: Story = {};

/** Story-level parameters merge with the ones from meta: this story changes one default and adds a select with labels. */
export const Danger: Story = {
  args: { primary: true, label: 'Delete' },
  parameters: {
    cssVars: {
      '--btn-bg': {
        type: 'select',
        label: 'Background',
        group: 'Colors',
        default: '#e5484d',
        options: { Red: '#e5484d', Orange: '#f76b15', Dark: '#1c2024' },
      },
    } satisfies CssVarsParameter,
  },
};
