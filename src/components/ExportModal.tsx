import { CheckIcon, CopyIcon } from '@storybook/icons';
import React, { useState } from 'react';
import { Button, Form, Modal, SyntaxHighlighter, useCopyButton } from 'storybook/internal/components';
import { styled } from 'storybook/theming';

import type { CssVarsOverrides, CssVarsParameter } from '../types';
import { buildChangedCss } from '../utils/exportCss';

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  params: CssVarsParameter;
  overrides: CssVarsOverrides;
}

const SelectorField = styled.label(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  fontSize: theme.typography.size.s2 - 1,
  color: theme.textMutedColor,
  whiteSpace: 'nowrap',
}));

const Code = styled.div({
  maxHeight: '50vh',
  overflow: 'auto',
});

export const ExportModal = ({ open, onOpenChange, params, overrides }: ExportModalProps) => {
  const [selector, setSelector] = useState(':root');
  const css = buildChangedCss(params, overrides, selector);

  const copy = useCopyButton({
    content: css,
    children: (
      <>
        <CopyIcon /> Copy CSS
      </>
    ),
    childrenOnCopy: (
      <>
        <CheckIcon /> Copied
      </>
    ),
    ariaLabel: 'Copy CSS to clipboard',
  });

  return (
    <Modal open={open} onOpenChange={onOpenChange} width={640} ariaLabel="Export changed CSS variables">
      <Modal.Content>
        <Modal.Header hasClose onClose={() => onOpenChange(false)}>
          <Modal.Title>Export CSS variables</Modal.Title>
          <Modal.Description>Only the variables you changed in this story.</Modal.Description>
        </Modal.Header>
        <SelectorField>
          Selector
          <Form.Input value={selector} onChange={(e) => setSelector(e.currentTarget.value)} placeholder=":root" />
        </SelectorField>
        <Code>
          <SyntaxHighlighter language="css" bordered padded copyable={false}>
            {css || '/* No changed variables */'}
          </SyntaxHighlighter>
        </Code>
        <Modal.Actions>
          <Button variant="solid" disabled={!css} {...copy.buttonProps}>
            {copy.children}
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </Modal.Actions>
      </Modal.Content>
    </Modal>
  );
};
