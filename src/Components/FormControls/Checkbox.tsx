// src/Components/FormControls/Checkbox.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Controller } from 'react-hook-form';
import { BaseFieldProps, FieldStyles } from '../../types';

interface CheckboxProps extends BaseFieldProps {
  styles?: FieldStyles;
  options?: { label: string; value: string }[];
}

export const Checkbox: React.FC<CheckboxProps> = ({
  name,
  label,
  control,
  error,
  required,
  disabled,
  options = [],
  styles = {},
}) => {
  return (
    <View style={[defaultStyles.container, styles.container]}>
      <Text style={defaultStyles.label}>
        {label} {required && '*'}
      </Text>
      <Controller
        name={name}
        control={control}
        defaultValue={[]}
        render={({ field: { onChange, value = [] } }) => (
          <View>
            {options.length > 0 ? (
              options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  testID={`checkbox-${option.value}`}
                  style={[defaultStyles.row, disabled && defaultStyles.disabled]}
                  onPress={() => {
                    if (disabled) return;
                    const currentValues = Array.isArray(value) ? value : [];
                    const newValues = currentValues.includes(option.value)
                      ? currentValues.filter(v => v !== option.value)
                      : [...currentValues, option.value];
                    onChange(newValues);
                  }}
                >
                  <View 
                    style={[
                      defaultStyles.box, 
                      (Array.isArray(value) && value.includes(option.value)) && defaultStyles.checked
                    ]}
                  >
                    {(Array.isArray(value) && value.includes(option.value)) && (
                      <Text style={defaultStyles.checkmark}>✓</Text>
                    )}
                  </View>
                  <Text style={defaultStyles.label}>{option.label}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <TouchableOpacity
                testID="checkbox-container"
                style={[defaultStyles.row, disabled && defaultStyles.disabled]}
                onPress={() => !disabled && onChange(!value)}
              >
                <View style={[defaultStyles.box, value && defaultStyles.checked]}>
                  {value && <Text style={defaultStyles.checkmark}>✓</Text>}
                </View>
                <Text style={defaultStyles.label}>
                  {label} {required && '*'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
      {error && <Text style={[defaultStyles.error, styles.error]}>{error}</Text>}
    </View>
  );
};

const defaultStyles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  box: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 4,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {
    backgroundColor: '#007AFF',
  },
  checkmark: {
    color: 'white',
    fontSize: 12,
  },
  label: {
    fontSize: 16,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Checkbox;