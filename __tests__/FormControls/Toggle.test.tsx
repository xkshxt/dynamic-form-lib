// src/__tests__/FormControls/Toggle.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Toggle } from '../../src/Components/FormControls/Toggle';
import { useForm } from 'react-hook-form';
import { FieldStyles } from '../../src/types';

interface WrapperProps {
  name?: string;
  label?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  styles?: FieldStyles;
  defaultValue?: boolean;
}

const ToggleWrapper: React.FC<WrapperProps> = ({
  name = 'testField',
  label = 'Test Label',
  required = false,
  error,
  disabled = false,
  styles = {} as FieldStyles,
  defaultValue = false,
}) => {
  const { control } = useForm({
    defaultValues: {
      [name]: defaultValue,
    },
  });

  return (
    <Toggle
      name={name}
      label={label}
      control={control}
      required={required}
      error={error}
      disabled={disabled}
      styles={styles}
    />
  );
};

describe('Toggle', () => {
  it('renders correctly with basic props', () => {
    const { getByText } = render(
      <ToggleWrapper name="testField" label="Test Label" />
    );

    expect(getByText('Test Label')).toBeTruthy();
  });

  it('shows required asterisk when required prop is true', () => {
    const { getByText } = render(
      <ToggleWrapper name="testField" label="Test Label" required={true} />
    );

    expect(getByText('Test Label *')).toBeTruthy();
  });

  it('shows error message when error prop is provided', () => {
    const errorMessage = 'This field is required';
    const { getByText } = render(
      <ToggleWrapper
        name="testField"
        label="Test Label"
        error={errorMessage}
      />
    );

    expect(getByText(errorMessage)).toBeTruthy();
  });

  it('handles toggle state correctly', () => {
    const { getByRole } = render(
      <ToggleWrapper name="testField" label="Test Label" />
    );

    const toggle = getByRole('switch');
    
    // Initially false
    expect(toggle.props.value).toBe(false);

    // Toggle on
    fireEvent(toggle, 'valueChange', true);
    expect(toggle.props.value).toBe(true);

    // Toggle off
    fireEvent(toggle, 'valueChange', false);
    expect(toggle.props.value).toBe(false);
  });

  it('respects default value', () => {
    const { getByRole } = render(
      <ToggleWrapper
        name="testField"
        label="Test Label"
        defaultValue={true}
      />
    );

    const toggle = getByRole('switch');
    expect(toggle.props.value).toBe(true);
  });

  it('respects disabled state', () => {
    const { getByRole } = render(
      <ToggleWrapper
        name="testField"
        label="Test Label"
        disabled={true}
      />
    );

    const toggle = getByRole('switch');
    expect(toggle.props.disabled).toBe(true);
  });

  it('applies custom styles correctly', () => {
    const customStyles: FieldStyles = {
      container: { backgroundColor: 'red' },
      label: { color: 'blue' },
      error: { color: 'yellow' },
    };
  
    const { getByTestId } = render(
      <ToggleWrapper
        name="testField"
        label="Test Label"
        error="Error message"
        styles={customStyles}
      />
    );
  
    const container = getByTestId('toggle-container');
    const label = getByTestId('toggle-label');
    const error = getByTestId('toggle-error');
  
    expect(container.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: 'red' })
      ])
    );
  
    expect(label.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ color: 'blue' })
      ])
    );
  
    expect(error.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ color: 'yellow' })
      ])
    );
  });
  

  it('maintains toggle state after multiple changes', () => {
    const { getByRole } = render(
      <ToggleWrapper name="testField" label="Test Label" />
    );

    const toggle = getByRole('switch');

    // First toggle
    fireEvent(toggle, 'valueChange', true);
    expect(toggle.props.value).toBe(true);

    // Second toggle
    fireEvent(toggle, 'valueChange', false);
    expect(toggle.props.value).toBe(false);

    // Third toggle
    fireEvent(toggle, 'valueChange', true);
    expect(toggle.props.value).toBe(true);
  });

  it('handles row layout correctly', () => {
    const { getByTestId } = render(
      <ToggleWrapper name="testField" label="Test Label" />
    );
  
    const row = getByTestId('toggle-row');
    
    expect(row.props.style).toEqual(
      expect.objectContaining({
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      })
    );
  });
});