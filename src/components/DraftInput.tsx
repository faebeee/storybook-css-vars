import React, { useState } from 'react';
import { Form } from 'storybook/internal/components';

type FormInputProps = React.ComponentProps<typeof Form.Input>;

interface DraftInputProps extends Omit<FormInputProps, 'value' | 'onChange'> {
  /** Value from the Storybook global. */
  value: string;
  /** Called on every keystroke with the raw input text. */
  onValueChange: (value: string) => void;
}

/**
 * An input that keeps its own text while it has focus.
 *
 * The panel values live in a Storybook global, which updates asynchronously via the preview.
 * Binding the input directly to it makes React re-render with a stale value between keystrokes,
 * which moves the cursor to the end and can overwrite what was just typed (e.g. an emptied
 * number field being refilled with its default). While focused, the input shows what the user
 * typed; otherwise it shows the global value, so resets, sliders, the color picker and URL
 * changes still show up.
 */
export const DraftInput = ({ value, onValueChange, onFocus, onBlur, ...rest }: DraftInputProps) => {
  const [draft, setDraft] = useState(value);
  const [focused, setFocused] = useState(false);

  return (
    <Form.Input
      {...rest}
      value={focused ? draft : value}
      onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
        setDraft(value);
        setFocused(true);
        onFocus?.(e);
      }}
      onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
        setFocused(false);
        onBlur?.(e);
      }}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        const next = e.currentTarget.value;
        setDraft(next);
        onValueChange(next);
      }}
    />
  );
};
