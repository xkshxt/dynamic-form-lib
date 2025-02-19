// src/__tests__/Button.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../src/Components/Button';

describe('Button', () => {
  const mockSubmit = jest.fn();
  const mockCancel = jest.fn();

  beforeEach(() => {
    mockSubmit.mockClear();
    mockCancel.mockClear();
  });

  it('renders submit and cancel buttons', () => {
    const { getByText } = render(
      <Button
        onSubmitButtonPress={mockSubmit}
        buttonTitle="Submit"
        cancelTitle="Cancel"
        onCancel={mockCancel}
      />
    );

    expect(getByText('Submit')).toBeTruthy();
    expect(getByText('Cancel')).toBeTruthy();
  });

  it('handles submit button press', () => {
    const { getByText } = render(
      <Button
        onSubmitButtonPress={mockSubmit}
        buttonTitle="Submit"
        cancelTitle="Cancel"
        onCancel={mockCancel}
      />
    );

    fireEvent.press(getByText('Submit'));
    expect(mockSubmit).toHaveBeenCalled();
  });

  it('handles cancel button press', () => {
    const { getByText } = render(
      <Button
        onSubmitButtonPress={mockSubmit}
        buttonTitle="Submit"
        cancelTitle="Cancel"
        onCancel={mockCancel}
      />
    );

    fireEvent.press(getByText('Cancel'));
    expect(mockCancel).toHaveBeenCalled();
  });

  it('disables submit button when disabled prop is true', () => {
    const { getByTestId } = render(
      <Button
        onSubmitButtonPress={mockSubmit}
        buttonTitle="Submit"
        cancelTitle="Cancel"
        onCancel={mockCancel}
        disabled={true}
      />
    );

    const submitButton = getByTestId('submit-button');
    expect(submitButton.props.accessibilityState.disabled).toBeTruthy();
  });

  it('applies custom styles', () => {
    const customStyles = {
      container: { backgroundColor: 'red' },
      submitButton: { backgroundColor: 'blue' },
      cancelButton: { backgroundColor: 'green' },
      labelText: { color: 'white' },
    };

    const { getByTestId } = render(
      <Button
        onSubmitButtonPress={mockSubmit}
        buttonTitle="Submit"
        cancelTitle="Cancel"
        onCancel={mockCancel}
        customButtonStyles={customStyles}
      />
    );

    const submitButton = getByTestId('submit-button');
    const cancelButton = getByTestId('cancel-button');

    expect(submitButton.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          backgroundColor: 'blue',
        }),
      ])
    );
    expect(cancelButton.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          backgroundColor: 'green',
        }),
      ])
    );
  });
});
