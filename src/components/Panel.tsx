import { ShareAltIcon, UndoIcon } from '@storybook/icons';
import React, { memo, useCallback, useState } from 'react';
import { AddonPanel, Button, IconButton } from 'storybook/internal/components';
import { useGlobals, useParameter } from 'storybook/manager-api';
import { styled } from 'storybook/theming';

import { GLOBAL_KEY, PARAM_KEY } from '../constants';
import type { CssVarsOverrides, CssVarsParameter } from '../types';
import { decodeOverrides, encodeOverrides } from '../utils/overrides';
import { groupVars } from '../utils/groupVars';
import { getChangedVars, getRawValue } from '../utils/resolveCssVars';
import { ExportModal } from './ExportModal';
import { VarControl } from './VarControl';

const Table = styled.div(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'minmax(160px, 1fr) minmax(200px, 2fr) 32px',
  fontSize: theme.typography.size.s2 - 1,
  color: theme.color.defaultText,
}));

const Cell = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: '10px 15px',
  borderBottom: `1px solid ${theme.appBorderColor}`,
  minWidth: 0,
}));

const HeadCell = styled(Cell)(({ theme }) => ({
  fontWeight: theme.typography.weight.bold,
  color: theme.textMutedColor,
  fontSize: theme.typography.size.s1,
  textTransform: 'uppercase',
  letterSpacing: '0.35em',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const GroupHeader = styled.div<{ first: boolean }>(({ theme, first }) => ({
  gridColumn: '1 / -1',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginTop: first ? 0 : 20,
  padding: '8px 15px 8px 12px',
  background: theme.background.hoverable,
  borderLeft: `3px solid ${theme.color.secondary}`,
  borderTop: `1px solid ${theme.appBorderColor}`,
  borderBottom: `1px solid ${theme.appBorderColor}`,
  fontWeight: theme.typography.weight.bold,
  fontSize: theme.typography.size.s2 - 1,
  color: theme.color.defaultText,
}));

const GroupCount = styled.span(({ theme }) => ({
  fontWeight: theme.typography.weight.regular,
  color: theme.textMutedColor,
  fontSize: theme.typography.size.s1,
}));

const Name = styled.label<{ changed: boolean }>(({ theme, changed }) => ({
  fontWeight: theme.typography.weight.bold,
  color: changed ? theme.color.secondary : 'inherit',
}));

const VarName = styled.code(({ theme }) => ({
  fontFamily: theme.typography.fonts.mono,
  fontSize: theme.typography.size.s1,
  color: theme.textMutedColor,
  overflowWrap: 'anywhere',
}));

const Description = styled.div(({ theme }) => ({
  marginTop: 4,
  color: theme.textMutedColor,
}));

const Empty = styled.div(({ theme }) => ({
  padding: 20,
  color: theme.textMutedColor,
  lineHeight: 1.6,
}));

export const Panel = memo(function CssVarsPanel({ active }: { active?: boolean }) {
  const params = useParameter<CssVarsParameter>(PARAM_KEY, {});
  const [globals, updateGlobals] = useGlobals();
  const overrides = decodeOverrides(globals[GLOBAL_KEY]);

  const setValue = useCallback(
    (name: string, value: string | number | undefined) => {
      const next: CssVarsOverrides = { ...overrides };
      if (value === undefined) delete next[name];
      else next[name] = value;
      updateGlobals({ [GLOBAL_KEY]: encodeOverrides(next) });
    },
    [overrides, updateGlobals],
  );

  const resetAll = useCallback(() => {
    const next: CssVarsOverrides = { ...overrides };
    Object.keys(params).forEach((name) => delete next[name]);
    updateGlobals({ [GLOBAL_KEY]: encodeOverrides(next) });
  }, [overrides, params, updateGlobals]);

  const entries = Object.entries(params).filter(([, config]) => !!config);
  const groups = groupVars(params);
  const changed = new Set(getChangedVars(params, overrides));
  const [exportOpen, setExportOpen] = useState(false);

  return (
    <AddonPanel active={active ?? false}>
      <>
        {entries.length === 0 ? (
          <Empty>
            This story has no CSS variables configured. Add them with the <code>{PARAM_KEY}</code> parameter.
          </Empty>
        ) : (
          <Table>
            <HeadCell>Variable</HeadCell>
            <HeadCell style={{ paddingTop: 4, paddingBottom: 4 }}>
              Value
              <Button
                size="small"
                variant="ghost"
                disabled={changed.size === 0}
                onClick={() => setExportOpen(true)}
                ariaLabel={false}
                tooltip="Export the changed variables as CSS"
                style={{ letterSpacing: 'normal', textTransform: 'none' }}
              >
                <ShareAltIcon /> Export CSS{changed.size ? ` (${changed.size})` : ''}
              </Button>
            </HeadCell>
            <HeadCell style={{ padding: '4px' }}>
              <Button
                size="small"
                variant="ghost"
                padding="small"
                disabled={changed.size === 0}
                onClick={resetAll}
                ariaLabel="Reset all CSS variables"
              >
                <UndoIcon />
              </Button>
            </HeadCell>
            {groups.map((group, index) => (
              <React.Fragment key={group.label ?? '__ungrouped'}>
                {group.label && (
                  <GroupHeader first={index === 0} role="heading" aria-level={3}>
                    {group.label}
                    <GroupCount>
                      {group.vars.length} {group.vars.length === 1 ? 'variable' : 'variables'}
                      {group.vars.some(([n]) => changed.has(n)) &&
                        `, ${group.vars.filter(([n]) => changed.has(n)).length} changed`}
                    </GroupCount>
                  </GroupHeader>
                )}
                {group.vars.map(([name, config]) => {
                  const isChanged = changed.has(name);
                  return (
                    <React.Fragment key={name}>
                      <Cell>
                        <Name htmlFor={`css-var-${name}`} changed={isChanged}>
                          {config.label ?? name}
                        </Name>
                        {config.label && <VarName>{name}</VarName>}
                        {config.description && <Description>{config.description}</Description>}
                      </Cell>
                      <Cell>
                        <VarControl
                          name={name}
                          config={config!}
                          value={getRawValue(name, config!, overrides)}
                          onChange={(v) =>
                            setValue(
                              name,
                              v === '' && (config.type === 'number' || config.type === 'size') ? undefined : v,
                            )
                          }
                        />
                      </Cell>
                      <Cell style={{ padding: 4, alignItems: 'center' }}>
                        {isChanged && (
                          <IconButton ariaLabel={`Reset ${name}`} onClick={() => setValue(name, undefined)}>
                            <UndoIcon />
                          </IconButton>
                        )}
                      </Cell>
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            ))}
          </Table>
        )}
        <ExportModal open={exportOpen} onOpenChange={setExportOpen} params={params} overrides={overrides} />
      </>
    </AddonPanel>
  );
});
