/**
 * Button
 *
 * This component renders two buttons:
 * one for submitting the form and one for canceling the form action.
 * It accepts custom styles to override the default appearance.
 */

import React from 'react';
import { StyleSheet, View, ViewStyle, TextStyle, Pressable, Text } from 'react-native';

/** Custom style interface for the button component */
export interface CustomButtonStyles {
  container?: ViewStyle;
  submitButton?: ViewStyle;
  cancelButton?: ViewStyle;
  labelText?: TextStyle;
}

/** Props for the Button */
export interface ButtonProps {
  /** Callback for when the Submit button is pressed */
  onSubmitButtonPress: () => void;
  /** Text for the Submit button */
  buttonTitle: string;
  /** Text for the Cancel button */
  cancelTitle: string;
  /** Callback for when the Cancel button is pressed */
  onCancel?: () => void;
  /** Disables the Submit button when true */
  disabled?: boolean;
  /** Custom styles to override default styling */
  customButtonStyles?: CustomButtonStyles;
}

// Define default colors for the buttons.
const COLORS = {
  darkGrey: '#444444',
  white: '#ffffff',
  submitButton: '#007BFF',
  borderGrey: '#cccccc',
};

const Button: React.FC<ButtonProps> = ({
  onSubmitButtonPress,
  buttonTitle,
  cancelTitle,
  onCancel,
  disabled,
  customButtonStyles = {},
}) => {
  return (
    <View style={[styles.container, customButtonStyles.container || {}]}>
      {/* Cancel Button */}
      <Pressable
        onPress={onCancel}
        style={({ pressed }) => [
          styles.cancelButton,
          customButtonStyles.cancelButton || {},
          pressed && { opacity: 0.7 },
        ]}
      >
        <Text style={[styles.labelText, customButtonStyles.labelText || {}]}>
          {cancelTitle}
        </Text>
      </Pressable>

      {/* Submit Button */}
      <Pressable
        onPress={onSubmitButtonPress}
        style={({ pressed }) => [
          styles.submitButton,
          customButtonStyles.submitButton || {},
          disabled && styles.disabledButton,
          pressed && { opacity: 0.7 },
        ]}
        disabled={disabled}
      >
        <Text style={[styles.labelText, customButtonStyles.labelText || {}, { color: COLORS.white }]}>
          {buttonTitle}
        </Text>
      </Pressable>
    </View>
  );
};

export default Button;

// Define default styles for the buttons.
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 24,
    backgroundColor: COLORS.white,
    marginHorizontal: -12,
  },
  labelText: {
    fontWeight: '600',
    fontSize: 14,
  },
  submitButton: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    backgroundColor: COLORS.submitButton,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButton: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderWidth: 0.8,
    borderColor: COLORS.borderGrey,
    borderRadius: 5,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#999',
  },
});
