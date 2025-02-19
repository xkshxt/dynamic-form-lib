// src/__tests__/FormControls/Checkbox.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Checkbox } from '../../src/Components/FormControls/Checkbox';
import { useForm } from 'react-hook-form';
import { FieldStyles } from '../../src/types';

interface WrapperProps {
  name?: string;
  label?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  styles?: FieldStyles;
  defaultChecked?: boolean;
}

const CheckboxWrapper: React.FC<WrapperProps> = ({
  name = 'testField',
  label = 'Test Label',
  required = false,
  error,
  disabled = false,
  styles = {} as FieldStyles,
  defaultChecked = false,
}) => {
  const { control } = useForm({
    defaultValues: {
      [name]: defaultChecked,
    },
  });

  return (
    <Checkbox
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

describe('Checkbox', () => {
  it('renders correctly with basic props', () => {
    const { getByText } = render(
      <CheckboxWrapper name="testField" label="Test Label" />
    );

    expect(getByText('Test Label')).toBeTruthy();
  });

  it('shows required asterisk when required prop is true', () => {
    const { getByText } = render(
      <CheckboxWrapper name="testField" label="Test Label" required={true} />
    );

    expect(getByText('Test Label *')).toBeTruthy();
  });

  it('shows error message when error prop is provided', () => {
    const errorMessage = 'This field is required';
    const { getByText } = render(
      <CheckboxWrapper
        name="testField"
        label="Test Label"
        error={errorMessage}
      />
    );

    expect(getByText(errorMessage)).toBeTruthy();
  });

  it('toggles checkbox state when pressed', () => {
    const { getByText, queryByText } = render(
      <CheckboxWrapper name="testField" label="Test Label" />
    );

    // Initially, checkbox should be unchecked
    expect(queryByText('✓')).toBeNull();

    // Press the checkbox
    fireEvent.press(getByText('Test Label'));

    // Checkbox should now be checked
    expect(queryByText('✓')).toBeTruthy();

    // Press again to uncheck
    fireEvent.press(getByText('Test Label'));

    // Checkbox should be unchecked again
    expect(queryByText('✓')).toBeNull();
  });

  it('respects default checked state', () => {
    const { queryByText } = render(
      <CheckboxWrapper
        name="testField"
        label="Test Label"
        defaultChecked={true}
      />
    );

    expect(queryByText('✓')).toBeTruthy();
  });

  it('does not toggle when disabled', () => {
    const { getByText, queryByText } = render(
      <CheckboxWrapper
        name="testField"
        label="Test Label"
        disabled={true}
      />
    );

    // Initially unchecked
    expect(queryByText('✓')).toBeNull();

    // Try to press the checkbox
    fireEvent.press(getByText('Test Label'));

    // Should still be unchecked
    expect(queryByText('✓')).toBeNull();
  });

  it('applies custom styles correctly', () => {
    const customStyles: FieldStyles = {
      container: { backgroundColor: 'red' },
      label: { color: 'blue' },
      error: { color: 'yellow' },
    };

    const { getByText } = render(
      <CheckboxWrapper
        name="testField"
        label="Test Label"
        error="Error message"
        styles={customStyles}
      />
    );

    const error = getByText('Error message');

    // Only test error styles as they're directly accessible
    expect(error.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ color: 'yellow' })
      ])
    );
  });

  it('applies disabled styles when disabled', () => {
    const { getByTestId } = render(
      <CheckboxWrapper
        name="testField"
        label="Test Label"
        disabled={true}
      />
    );
  
    const touchableContainer = getByTestId('checkbox-container');
    
    // Check if the style object contains the opacity property
    expect(touchableContainer.props.style).toMatchObject({
      opacity: 0.5
    });
  });

  it('maintains checked state after multiple toggles', () => {
    const { getByText, queryByText } = render(
      <CheckboxWrapper name="testField" label="Test Label" />
    );

    // First toggle
    fireEvent.press(getByText('Test Label'));
    expect(queryByText('✓')).toBeTruthy();

    // Second toggle
    fireEvent.press(getByText('Test Label'));
    expect(queryByText('✓')).toBeNull();

    // Third toggle
    fireEvent.press(getByText('Test Label'));
    expect(queryByText('✓')).toBeTruthy();
  });
});