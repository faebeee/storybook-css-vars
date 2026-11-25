import React from 'react';
import { Form } from 'storybook/internal/components';
import { styled } from 'storybook/theming';

import { DEFAULT_SIZE_UNITS } from '../constants';
import type { CssVarConfig } from '../types';
import { parseSize } from '../utils/resolveCssVars';

interface VarControlProps {
  name: string;
  config: CssVarConfig;
  value: string | number | undefined;
  onChange: (value: string | number) => void;
}

const Row = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  width: '100%',
});

const Swatch = styled.input(({ theme }) => ({
  flex: '0 0 auto',
  width: 32,
  height: 32,
  padding: 0,
  border: `1px solid ${theme.appBorderColor}`,
  borderRadius: theme.input.borderRadius,
  background: 'transparent',
  cursor: 'pointer',
}));

const Range = styled.input({
  flex: '1 1 auto',
  minWidth: 60,
});

const NativeSelect = styled.select(({ theme }) => ({
  width: '100%',
  height: 32,
  padding: '0 8px',
  color: theme.input.color,
  background: theme.input.background,
  border: `1px solid ${theme.input.border}`,
  borderRadius: theme.input.borderRadius,
  fontSize: theme.typography.size.s2 - 1,
}));

const NumberBox = styled.div<{ grow: boolean }>(({ grow }) => ({
  flex: grow ? '1 1 auto' : '0 0 96px',
  minWidth: 0,
}));

const Unit = styled.span(({ theme }) => ({
  flex: '0 0 auto',
  color: theme.textMutedColor,
  fontFamily: theme.typography.fonts.mono,
  fontSize: theme.typography.size.s1,
}));

const UnitSelect = styled(NativeSelect)({
  flex: '0 0 72px',
  width: 72,
});

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

/** `<input type="color">` only understands #rrggbb. */
function toPickerHex(value: string): string {
  if (!HEX.test(value)) return '#000000';
  if (value.length === 4) {
    return `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`.toLowerCase();
  }
  return value.toLowerCase();
}

export const VarControl = ({ name, config, value, onChange }: VarControlProps) => {
  const id = `css-var-${name}`;
  const str = value === undefined ? '' : String(value);

  switch (config.type) {
    case 'color':
      return (
        <Row>
          <Swatch
            type="color"
            aria-label={`${name} color picker`}
            value={toPickerHex(str)}
            onChange={(e) => onChange(e.target.value)}
          />
          <Form.Input
            id={id}
            value={str}
            placeholder="e.g. #0057ff"
            onChange={(e) => onChange(e.currentTarget.value)}
          />
        </Row>
      );

    case 'number': {
      const hasRange = config.min !== undefined && config.max !== undefined;
      const num = str === '' ? '' : Number(str);
      return (
        <Row>
          {hasRange && (
            <Range
              type="range"
              aria-label={`${name} slider`}
              min={config.min}
              max={config.max}
              step={config.step ?? 1}
              value={num === '' ? config.min : num}
              onChange={(e) => onChange(Number(e.target.value))}
            />
          )}
          <NumberBox grow={!hasRange}>
            <Form.Input
              id={id}
              type="number"
              min={config.min}
              max={config.max}
              step={config.step ?? 1}
              value={num}
              onChange={(e) => {
                const v = e.currentTarget.value;
                onChange(v === '' ? '' : Number(v));
              }}
            />
          </NumberBox>
          {config.unit && <Unit>{config.unit}</Unit>}
        </Row>
      );
    }

    case 'size': {
      const hasRange = config.min !== undefined && config.max !== undefined;
      const units = config.units ?? DEFAULT_SIZE_UNITS;
      const size = parseSize(value, config);
      const unit = size?.unit ?? config.unit ?? units[0] ?? '';
      const emit = (num: number | '', nextUnit: string) => onChange(num === '' ? '' : `${num}${nextUnit}`);
      return (
        <Row>
          {hasRange && (
            <Range
              type="range"
              aria-label={`${name} slider`}
              min={config.min}
              max={config.max}
              step={config.step ?? 1}
              value={size?.value ?? config.min}
              onChange={(e) => emit(Number(e.target.value), unit)}
            />
          )}
          <NumberBox grow={!hasRange}>
            <Form.Input
              id={id}
              type="number"
              min={config.min}
              max={config.max}
              step={config.step ?? 'any'}
              value={size?.value ?? ''}
              onChange={(e) => {
                const v = e.currentTarget.value;
                emit(v === '' ? '' : Number(v), unit);
              }}
            />
          </NumberBox>
          <UnitSelect
            aria-label={`${name} unit`}
            value={unit}
            onChange={(e) => emit(size?.value ?? '', e.target.value)}
          >
            {!units.includes(unit) && <option value={unit}>{unit}</option>}
            {units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </UnitSelect>
        </Row>
      );
    }

    case 'select': {
      const options = Array.isArray(config.options)
        ? config.options.map((v) => [v, v] as const)
        : Object.entries(config.options);
      return (
        <NativeSelect id={id} value={str} onChange={(e) => onChange(e.target.value)}>
          {!options.some(([, v]) => v === str) && <option value={str}>{str === '' ? 'Choose…' : str}</option>}
          {options.map(([label, v]) => (
            <option key={v} value={v}>
              {label}
            </option>
          ))}
        </NativeSelect>
      );
    }

    case 'text':
    default:
      return <Form.Input id={id} value={str} onChange={(e) => onChange(e.currentTarget.value)} />;
  }
};
