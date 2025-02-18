import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import DynamicForm from '../DynamicForm';
import { Text } from 'react-native';



describe('DynamicForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  const defaultProps = {
    onSubmit: mockOnSubmit,
    onCancel: mockOnCancel,
    formTitle: 'Test Form',
    buttonTitle: 'Submit',
    cancelTitle: 'Cancel',
    initialValues: {
      name: 'John Doe',
      age: 30,
      email: 'john.doe@example.com',
      hobbies: ['Reading'],
    },
  };

  it('renders form title correctly', () => {
    const { getByTestId } = render(
      <DynamicForm {...defaultProps}>
        <Text>Test Content</Text>
      </DynamicForm>
    );

    const formTitle = getByTestId('FormTitle');
    expect(formTitle).toBeTruthy();
    expect(formTitle.props.children).toBe('Test Form');
  });

  it('calls onSubmit when the form is submitted', async () => {
    const { getByText } = render(
      <DynamicForm {...defaultProps}>
        <Text>Test Content</Text>
      </DynamicForm>
    );

    await act(async () => {
      fireEvent.press(getByText('Submit'));
    });

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it('calls onCancel when the cancel button is pressed', async () => {
    const { getByText } = render(
      <DynamicForm {...defaultProps}>
        <Text>Test Content</Text>
      </DynamicForm>
    );

    await act(async () => {
      fireEvent.press(getByText('Cancel'));
    });

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('displays validation errors for invalid input', async () => {
    const { getByText, getByPlaceholderText } = render(
      <DynamicForm {...defaultProps} initialValues={{ name: '', age: 17, email: 'invalid', hobbies: [] }}>
        <Text>Test Content</Text>
      </DynamicForm>
    );
  
    await act(async () => {
      fireEvent.press(getByText('Submit'));
    });
  
    expect(getByText('Name must be at least 2 characters')).toBeTruthy();
    expect(getByText('Age must be 18 or above')).toBeTruthy();
    expect(getByText('Invalid email address')).toBeTruthy();
    expect(getByText('At least one hobby is required')).toBeTruthy();
  });
  
  it('applies custom styles correctly', () => {
    const customStyles = {
      formContainer: { backgroundColor: 'blue' },
      headerContainer: { backgroundColor: 'green' },
      headerText: { color: 'red' },
    };
  
    const { getByTestId } = render(
      <DynamicForm {...defaultProps} customStyles={customStyles}>
        <Text>Test Content</Text>
      </DynamicForm>
    );
  
    const formTitle = getByTestId('FormTitle');
    expect(formTitle.props.style).toContainEqual({ color: 'red' });
  });

  // Add more tests for form validation and accessibility as needed
});