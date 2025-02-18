import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FormButtonComponent from '../FormButtonComponent';


describe('FormButtonComponent', () => {
  const defaultProps = {
    onSubmitButtonPress: jest.fn(),
    buttonTitle: 'Submit',
    cancelTitle: 'Cancel',
    onCancel: jest.fn(),
  };

  it('renders submit and cancel buttons with correct titles', () => {
    const { getByText } = render(<FormButtonComponent {...defaultProps} />);
    
    expect(getByText('Submit')).toBeTruthy();
    expect(getByText('Cancel')).toBeTruthy();
  });

  it('calls onSubmitButtonPress when submit button is pressed', () => {
    const onSubmitButtonPress = jest.fn();
    const { getByText } = render(
      <FormButtonComponent {...defaultProps} onSubmitButtonPress={onSubmitButtonPress} />
    );

    fireEvent.press(getByText('Submit'));
    expect(onSubmitButtonPress).toHaveBeenCalled();
  });

  it('calls onCancel when cancel button is pressed', () => {
    const onCancel = jest.fn();
    const { getByText } = render(
      <FormButtonComponent {...defaultProps} onCancel={onCancel} />
    );

    fireEvent.press(getByText('Cancel'));
    expect(onCancel).toHaveBeenCalled();
  });

  // Add more tests for button disabled state, styles, and accessibility as needed
});