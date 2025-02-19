// src/__tests__/DynamicForm.test.tsx
import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import DynamicForm from '../src/Components/DynamicForm';
import { TextInput } from '../src/Components/FormControls/TextInput';
import { z } from 'zod';
import { FieldType } from '../src/types';

describe('DynamicForm', () => {
  const mockSubmit = jest.fn();
  const mockCancel = jest.fn();

  const basicFormConfig = {
    sections: [
      {
        title: 'Personal Information',
        fields: [
          {
            name: 'firstName',
            type: 'text' as FieldType,
            label: 'First Name',
            required: true,
            validation: z.string().min(2, 'Name must be at least 2 characters'),
          },
          {
            name: 'email',
            type: 'text' as FieldType,
            label: 'Email',
            validation: z.string().email('Invalid email format'),
          },
        ],
      },
    ],
    components: {
      text: TextInput,
    },
  };

  beforeEach(() => {
    mockSubmit.mockClear();
    mockCancel.mockClear();
  });

  it('renders form with title', () => {
    const { getByText } = render(
      <DynamicForm
        {...basicFormConfig}
        formTitle="Test Form"
        onSubmit={mockSubmit}
      />
    );

    expect(getByText('Test Form')).toBeTruthy();
  });

  it('renders form fields correctly', () => {
    const { getByTestId, queryByText } = render(
      <DynamicForm
        {...basicFormConfig}
        onSubmit={mockSubmit}
      />
    );

    const firstNameField = getByTestId('input-firstName');
    const emailField = getByTestId('input-email');
    
    expect(firstNameField).toBeTruthy();
    expect(emailField).toBeTruthy();
    expect(queryByText(/First Name/)).toBeTruthy();
    expect(queryByText(/Email/)).toBeTruthy();
  });

  it('shows validation errors on submit with empty required fields', async () => {
    const { getByTestId, getByText } = render(
      <DynamicForm
        {...basicFormConfig}
        onSubmit={mockSubmit}
      />
    );

    await act(async () => {
      // First set an empty value
      fireEvent.changeText(getByTestId('input-firstName'), '');
      // Then trigger form submission
      fireEvent.press(getByText('Submit'));
    });

    await waitFor(() => {
      const errorElement = getByTestId('error-firstName');
      expect(errorElement).toBeTruthy();
      expect(errorElement.props.children).toBe('Name must be at least 2 characters');
    }, { timeout: 2000 });

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('shows validation error for invalid email', async () => {
    const { getByTestId, getByText } = render(
      <DynamicForm
        {...basicFormConfig}
        onSubmit={mockSubmit}
      />
    );

    await act(async () => {
      fireEvent.changeText(getByTestId('input-firstName'), 'John');
      fireEvent.changeText(getByTestId('input-email'), 'invalid-email');
      fireEvent.press(getByText('Submit'));
    });

    await waitFor(() => {
      const errorElement = getByTestId('error-email');
      expect(errorElement).toBeTruthy();
      expect(errorElement.props.children).toBe('Invalid email format');
    });

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with form data when validation passes', async () => {
    const { getByTestId, getByText } = render(
      <DynamicForm
        {...basicFormConfig}
        onSubmit={mockSubmit}
      />
    );

    await act(async () => {
      fireEvent.changeText(getByTestId('input-firstName'), 'John');
      fireEvent.changeText(getByTestId('input-email'), 'john@example.com');
    });

    await act(async () => {
      fireEvent.press(getByText('Submit'));
    });

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        firstName: 'John',
        email: 'john@example.com',
      });
    });
  });

  it('handles cancel action', async () => {
    const { getByTestId } = render(
      <DynamicForm
        {...basicFormConfig}
        onSubmit={mockSubmit}
        onCancel={mockCancel}
      />
    );

    await act(async () => {
      fireEvent.press(getByTestId('cancel-button'));
    });

    expect(mockCancel).toHaveBeenCalled();
  });

  it('shows loading state during submission', async () => {
    const asyncSubmit = jest.fn().mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );
    
    const { getByTestId, getByText } = render(
      <DynamicForm
        {...basicFormConfig}
        onSubmit={asyncSubmit}
      />
    );

    await act(async () => {
      fireEvent.changeText(getByTestId('input-firstName'), 'John');
      fireEvent.changeText(getByTestId('input-email'), 'john@example.com');
    });

    await act(async () => {
      fireEvent.press(getByText('Submit'));
    });

    expect(getByTestId('loading-indicator')).toBeTruthy();

    await waitFor(() => {
      expect(asyncSubmit).toHaveBeenCalled();
    });
  });

  it('clears error when valid input is provided', async () => {
    const { getByTestId, getByText, queryByTestId } = render(
      <DynamicForm
        {...basicFormConfig}
        onSubmit={mockSubmit}
      />
    );

    // First trigger error
    await act(async () => {
      fireEvent.changeText(getByTestId('input-firstName'), '');
      fireEvent.press(getByText('Submit'));
    });

    // Verify error appears
    await waitFor(() => {
      expect(getByTestId('error-firstName')).toBeTruthy();
    });

    // Fix the error
    await act(async () => {
      fireEvent.changeText(getByTestId('input-firstName'), 'John');
    });

    // Submit again
    await act(async () => {
      fireEvent.press(getByText('Submit'));
    });

    // Verify error is gone
    await waitFor(() => {
      expect(queryByTestId('error-firstName')).toBeNull();
    });
  });
});