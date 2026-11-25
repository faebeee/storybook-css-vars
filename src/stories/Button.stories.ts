import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import type { CssVarsParameter } from '../types';
import { Button } from './Button';

const cssVars: CssVarsParameter = {
  '--btn-bg': { type: 'color', default: '#1ea7fd', label: 'Background' },
  '--btn-fg': { type: 'color', label: 'Text color', description: 'Leave empty to use the CSS fallback' },
  '--btn-radius': { type: 'number', default: 24, unit: 'px', min: 0, max: 48, step: 1, label: 'Radius' },
  '--btn-padding-x': { type: 'size', default: '1.25rem', units: ['px', 'rem', 'em'], label: 'Padding X' },
  '--btn-min-width': {
    type: 'size',
    label: 'Min width',
    description: 'Size with the full unit list. Empty means no min width.',
  },
  '--btn-weight': { type: 'select', default: '700', options: ['400', '500', '700', '900'], label: 'Font weight' },
  '--btn-shadow': {
    type: 'text',
    default: 'none',
    label: 'Shadow',
    description: 'Any box-shadow value',
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
        default: '#e5484d',
        options: { Red: '#e5484d', Orange: '#f76b15', Dark: '#1c2024' },
      },
    } satisfies CssVarsParameter,
  },
};
