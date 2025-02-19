// src/Components/FormControls/Toggle.tsx
import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { Controller } from 'react-hook-form';
import { BaseFieldProps, FieldStyles } from '../../types';

interface ToggleProps extends BaseFieldProps {
  styles?: FieldStyles;
}

const defaultStyles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});

export const Toggle: React.FC<ToggleProps> = ({
  name,
  label,
  control,
  error,
  required,
  disabled,
  styles = {},
}) => {
  return (
    <View 
      testID="toggle-container"
      style={[defaultStyles.container, styles.container]}
    >
      <View 
        testID="toggle-row"
        style={defaultStyles.row}
      >
        <Text 
          testID="toggle-label"
          style={[defaultStyles.label, styles.label]}
        >
          {label} {required && '*'}
        </Text>
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, value } }) => (
            <Switch
              testID="toggle-switch"
              value={value}
              onValueChange={onChange}
              disabled={disabled}
            />
          )}
        />
      </View>
      {error && (
        <Text 
          testID="toggle-error"
          style={[defaultStyles.error, styles.error]}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

export default Toggle;