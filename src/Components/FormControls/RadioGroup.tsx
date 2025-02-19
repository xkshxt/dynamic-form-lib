// src/Components/FormControls/RadioGroup.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Controller } from 'react-hook-form';
import { BaseFieldProps, FieldStyles } from '../../types';

interface RadioGroupProps extends BaseFieldProps {
  options: { label: string; value: any }[];
  styles?: FieldStyles;
}

// Update RadioGroup.tsx
export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  label,
  control,
  error,
  required,
  disabled,
  options,
  styles = {},
}) => {
  return (
    <View 
      testID="radio-group-container"
      style={[defaultStyles.container, styles.container]}
    >
      <Text 
        testID="radio-group-label"
        style={[defaultStyles.label, styles.label]}
      >
        {label} {required && '*'}
      </Text>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <View 
            testID="radio-group-options"
            style={defaultStyles.optionsContainer}
          >
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                testID={`radio-option-${option.value}`}
                style={[
                  defaultStyles.option,
                  value === option.value && defaultStyles.selectedOption,
                  disabled && defaultStyles.disabled,
                ]}
                onPress={() => !disabled && onChange(option.value)}
              >
                <View 
                  testID={`radio-circle-${option.value}`}
                  style={defaultStyles.radio}
                >
                  {value === option.value && (
                    <View 
                      testID={`radio-selected-${option.value}`}
                      style={defaultStyles.selected} 
                    />
                  )}
                </View>
                <Text style={defaultStyles.optionLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      />
      {error && (
        <Text 
          testID="radio-group-error"
          style={[defaultStyles.error, styles.error]}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

const defaultStyles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  optionsContainer: {
    marginTop: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  optionLabel: {
    fontSize: 16,
  },
  selectedOption: {
    opacity: 1,
  },
  disabled: {
    opacity: 0.5,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});