// src/__tests__/FormControls/Dropdown.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Dropdown } from '../../src/Components/FormControls/Dropdown';
import { useForm } from 'react-hook-form';
import { FieldStyles } from '../../src/types';

interface WrapperProps {
  name?: string;
  label?: string;
  required?: boolean;
  error?: string;
  options: { label: string; value: any }[];
  disabled?: boolean;
  styles?: FieldStyles;
}

const DropdownWrapper: React.FC<WrapperProps> = ({
  name = 'testField',
  label = 'Test Label',
  required = false,
  error,
  options,
  disabled = false,
  styles = {} as FieldStyles,
}) => {
  const { control } = useForm({
    defaultValues: {
      [name]: '',
    },
  });

  return (
    <Dropdown
      name={name}
      label={label}
      control={control}
      required={required}
      error={error}
      options={options}
      disabled={disabled}
      styles={styles}
    />
  );
};

const mockOptions = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
];

describe('Dropdown', () => {
  it('renders correctly with basic props', () => {
    const { getByText } = render(
      <DropdownWrapper 
        name="testField" 
        label="Test Label" 
        options={mockOptions} 
      />
    );

    expect(getByText('Test Label')).toBeTruthy();
    expect(getByText('Select...')).toBeTruthy();
  });

  it('shows required asterisk when required prop is true', () => {
    const { getByText } = render(
      <DropdownWrapper 
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
      <DropdownWrapper
        name="testField"
        label="Test Label"
        error={errorMessage}
        options={mockOptions}
      />
    );

    expect(getByText(errorMessage)).toBeTruthy();
  });

  it('opens modal when dropdown is pressed', () => {
    const { getByText, queryByText } = render(
      <DropdownWrapper
        name="testField"
        label="Test Label"
        options={mockOptions}
      />
    );

    // Initially, option shouldn't be visible
    expect(queryByText('Option 1')).toBeNull();

    // Press the dropdown
    fireEvent.press(getByText('Select...'));

    // Now option should be visible
    expect(getByText('Option 1')).toBeTruthy();
  });

  it('selects option and closes modal when option is pressed', () => {
    const { getByText, queryByText } = render(
      <DropdownWrapper
        name="testField"
        label="Test Label"
        options={mockOptions}
      />
    );

    // Open dropdown
    fireEvent.press(getByText('Select...'));

    // Select an option
    fireEvent.press(getByText('Option 1'));

    // Modal should be closed and selected option should be shown
    expect(queryByText('Option 2')).toBeNull(); // Modal closed
    expect(getByText('Option 1')).toBeTruthy(); // Selected option shown
  });

  it('does not open modal when disabled', () => {
    const { getByText, queryByText } = render(
      <DropdownWrapper
        name="testField"
        label="Test Label"
        options={mockOptions}
        disabled={true}
      />
    );

    fireEvent.press(getByText('Select...'));

    // Modal should not open
    expect(queryByText('Option 1')).toBeNull();
  });

  it('applies custom styles correctly', () => {
    const customStyles: FieldStyles = {
      container: { backgroundColor: 'red' },
      label: { color: 'blue' },
      input: { borderColor: 'green' },
      error: { color: 'yellow' },
    };

    const { getByText } = render(
      <DropdownWrapper
        name="testField"
        label="Test Label"
        options={mockOptions}
        error="Error message"
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

  it('displays all options in the modal', () => {
    const { getByText, queryByText } = render(
      <DropdownWrapper
        name="testField"
        label="Test Label"
        options={mockOptions}
      />
    );

    // Open dropdown
    fireEvent.press(getByText('Select...'));

    // All options should be visible
    mockOptions.forEach(option => {
      expect(getByText(option.label)).toBeTruthy();
    });
  });

  it('maintains selected value after modal is closed', () => {
    const { getByText } = render(
      <DropdownWrapper
        name="testField"
        label="Test Label"
        options={mockOptions}
      />
    );

    // Open dropdown
    fireEvent.press(getByText('Select...'));

    // Select an option
    fireEvent.press(getByText('Option 1'));

    // Verify selected option is still shown
    expect(getByText('Option 1')).toBeTruthy();

    // Open dropdown again
    fireEvent.press(getByText('Option 1'));

    // Select another option
    fireEvent.press(getByText('Option 2'));

    // Verify new selection is shown
    expect(getByText('Option 2')).toBeTruthy();
  });
});