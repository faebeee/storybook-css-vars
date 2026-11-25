import React from 'react';
import './button.css';

interface ButtonProps {
  primary?: boolean;
  label: string;
  onClick?: () => void;
}

/** Demo button that is styled entirely through CSS custom properties. */
export const Button = ({ primary = false, label, ...props }: ButtonProps) => (
  <button
    type="button"
    className={['storybook-button', primary ? 'storybook-button--primary' : 'storybook-button--secondary'].join(' ')}
    {...props}
  >
    {label}
  </button>
);
