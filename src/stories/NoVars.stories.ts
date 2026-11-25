import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from './Button';

/** A story without `cssVars`: the panel shows its empty state and no variables are applied. */
const meta = {
  title: 'Example/Without CSS vars',
  component: Button,
  args: { label: 'Plain button', primary: true },
} satisfies Meta<typeof Button>;

export default meta;

export const Default: StoryObj<typeof meta> = {};
