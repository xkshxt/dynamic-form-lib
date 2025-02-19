// src/__tests__/FormControls/TextInput.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TextInput } from '../../src/Components/FormControls/TextInput';
import { useForm } from 'react-hook-form';
import { FieldStyles } from '../../src/types';

interface WrapperProps {
  name?: string;
  label?: string;
  required?: boolean;
  error?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  disabled?: boolean;
  styles?: FieldStyles;
}

const TextInputWrapper: React.FC<WrapperProps> = ({
  name = 'testField',
  label = 'Test Label',
  required = false,
  error,
  placeholder = 'Enter text',
  secureTextEntry = false,
  keyboardType = 'default',
  disabled = false,
  styles = {} as FieldStyles,
}) => {
  const { control } = useForm({
    defaultValues: {
      [name]: '',
    },
  });

  return (
    <TextInput
      name={name}
      label={label}
      control={control}
      required={required}
      error={error}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      disabled={disabled}
      styles={styles}
    />
  );
};

describe('TextInput', () => {
  it('renders correctly with basic props', () => {
    const { getByText, getByTestId } = render(
      <TextInputWrapper name="testField" label="Test Label" />
    );

    expect(getByText('Test Label')).toBeTruthy();
    expect(getByTestId('input-testField')).toBeTruthy();
  });

  it('shows required asterisk when required prop is true', () => {
    const { getByText } = render(
      <TextInputWrapper name="testField" label="Test Label" required={true} />
    );

    expect(getByText('Test Label *')).toBeTruthy();
  });

  it('shows error message when error prop is provided', () => {
    const errorMessage = 'This field is required';
    const { getByTestId, getByText } = render(
      <TextInputWrapper
        name="testField"
        label="Test Label"
        error={errorMessage}
      />
    );

    const errorElement = getByTestId('error-testField');
    expect(errorElement).toBeTruthy();
    expect(getByText(errorMessage)).toBeTruthy();
  });

  it('handles text input correctly', () => {
    const { getByTestId } = render(
      <TextInputWrapper name="testField" label="Test Label" />
    );

    const input = getByTestId('input-testField');
    fireEvent.changeText(input, 'test value');
    expect(input.props.value).toBe('test value');
  });

  it('applies disabled state correctly', () => {
    const { getByTestId } = render(
      <TextInputWrapper name="testField" label="Test Label" disabled={true} />
    );

    const input = getByTestId('input-testField');
    expect(input.props.editable).toBe(false);
  });

  it('applies custom styles correctly', () => {
    const customStyles: FieldStyles = {
      container: { backgroundColor: 'red' },
      label: { color: 'blue' },
      input: { borderColor: 'green' },
      error: { color: 'yellow' },
    };

    const errorMessage = 'Error message';
    const { getByTestId, getByText } = render(
      <TextInputWrapper
        name="testField"
        label="Test Label"
        error={errorMessage}
        styles={customStyles}
      />
    );

    const input = getByTestId('input-testField');
    const label = getByText('Test Label');
    const error = getByTestId('error-testField');

    // Check input styles
    expect(input.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ borderColor: 'green' })
      ])
    );

    // Check label styles
    expect(label.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ color: 'blue' })
      ])
    );

    // Check error styles
    expect(error.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ color: 'yellow' })
      ])
    );
  });

  it('handles different keyboard types', () => {
    const { getByTestId } = render(
      <TextInputWrapper
        name="testField"
        label="Test Label"
        keyboardType="email-address"
      />
    );

    const input = getByTestId('input-testField');
    expect(input.props.keyboardType).toBe('email-address');
  });

  it('handles secure text entry', () => {
    const { getByTestId } = render(
      <TextInputWrapper
        name="testField"
        label="Test Label"
        secureTextEntry={true}
      />
    );

    const input = getByTestId('input-testField');
    expect(input.props.secureTextEntry).toBe(true);
  });

  it('has correct accessibility labels', () => {
    const errorMessage = 'Error message';
    const { getByTestId } = render(
      <TextInputWrapper
        name="testField"
        label="Test Label"
        required={true}
        error={errorMessage}
      />
    );

    const input = getByTestId('input-testField');
    const error = getByTestId('error-testField');

    expect(input.props.accessibilityLabel).toBe('Test Label *');
    expect(error.props.accessibilityLabel).toBe(`Error: ${errorMessage}`);
  });
});