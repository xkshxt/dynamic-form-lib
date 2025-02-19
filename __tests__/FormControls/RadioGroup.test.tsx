// src/__tests__/FormControls/RadioGroup.test.tsx
import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { RadioGroup } from '../../src/Components/FormControls/RadioGroup';
import { useForm } from 'react-hook-form';
import { FieldStyles } from '../../src/types';

interface WrapperProps {
  name?: string;
  label?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  styles?: FieldStyles;
  options: { label: string; value: any }[];
  defaultValue?: any;
}

const mockOptions = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
];

const RadioGroupWrapper: React.FC<WrapperProps> = ({
  name = 'testField',
  label = 'Test Label',
  required = false,
  error,
  disabled = false,
  styles = {} as FieldStyles,
  options = mockOptions,
  defaultValue,
}) => {
  const { control } = useForm({
    defaultValues: {
      [name]: defaultValue,
    },
  });

  return (
    <RadioGroup
      name={name}
      label={label}
      control={control}
      required={required}
      error={error}
      disabled={disabled}
      options={options}
      styles={styles}
    />
  );
};

describe('RadioGroup', () => {
  it('renders correctly with basic props', () => {
    const { getByText } = render(
      <RadioGroupWrapper 
        name="testField" 
        label="Test Label" 
        options={mockOptions} 
      />
    );

    expect(getByText('Test Label')).toBeTruthy();
    mockOptions.forEach(option => {
      expect(getByText(option.label)).toBeTruthy();
    });
  });

  it('shows required asterisk when required prop is true', () => {
    const { getByText } = render(
      <RadioGroupWrapper 
        name="testField" 
        label="Test Label" 
        required={true} 
        options={mockOptions}
      />
    );

    expect(getByText('Test Label *')).toBeTruthy();
  });

  it('shows error message when error prop is provided', () => {
    const errorMessage = 'This field is required';
    const { getByText } = render(
      <RadioGroupWrapper
        name="testField"
        label="Test Label"
        error={errorMessage}
        options={mockOptions}
      />
    );

    expect(getByText(errorMessage)).toBeTruthy();
  });

  it('selects option when clicked', async () => {
    const { getByTestId } = render(
      <RadioGroupWrapper 
        name="testField" 
        label="Test Label" 
        options={mockOptions}
      />
    );
  
    // Click first option
    fireEvent.press(getByTestId('radio-option-1'));
  
    // Wait for state update
    await new Promise(resolve => setTimeout(resolve, 0));
  
    // Check if the selected indicator is present
    expect(getByTestId('radio-selected-1')).toBeTruthy();
  });

  it('respects default value', () => {
    const { getByTestId } = render(
      <RadioGroupWrapper
        name="testField"
        label="Test Label"
        options={mockOptions}
        defaultValue="2"
      />
    );
  
    // Check if the selected indicator is present for option 2
    expect(getByTestId('radio-selected-2')).toBeTruthy();
  });

  it('does not allow selection when disabled', async () => {
  const { getByTestId, queryByTestId } = render(
    <RadioGroupWrapper
      name="testField"
      label="Test Label"
      options={mockOptions}
      disabled={true}
    />
  );

  // Try to select an option
  fireEvent.press(getByTestId('radio-option-1'));

  // Wait for state update
  await new Promise(resolve => setTimeout(resolve, 0));

  // Check that no option is selected
  expect(queryByTestId('radio-selected-1')).toBeNull();
});

  it('applies custom styles correctly', () => {
    const customStyles: FieldStyles = {
      container: { backgroundColor: 'red' },
      label: { color: 'blue' },
      error: { color: 'yellow' },
    };

    const { getByText } = render(
      <RadioGroupWrapper
        name="testField"
        label="Test Label"
        error="Error message"
        options={mockOptions}
        styles={customStyles}
      />
    );

    const label = getByText('Test Label');
    const error = getByText('Error message');

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

  it('allows changing selection', async () => {
    const { getByTestId, queryByTestId } = render(
      <RadioGroupWrapper
        name="testField"
        label="Test Label"
        options={mockOptions}
      />
    );
  
    // Select first option
    fireEvent.press(getByTestId('radio-option-1'));
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(getByTestId('radio-selected-1')).toBeTruthy();
  
    // Change to second option
    fireEvent.press(getByTestId('radio-option-2'));
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(getByTestId('radio-selected-2')).toBeTruthy();
    expect(queryByTestId('radio-selected-1')).toBeNull();
  });
  
  

  it('renders all options with correct styling', () => {
    const { getByTestId } = render(
      <RadioGroupWrapper
        name="testField"
        label="Test Label"
        options={mockOptions}
      />
    );
  
    const optionsContainer = getByTestId('radio-group-options');
    expect(optionsContainer).toBeTruthy();
  
    mockOptions.forEach(option => {
      const optionElement = getByTestId(`radio-option-${option.value}`);
      expect(optionElement).toBeTruthy();
    });
  });
});