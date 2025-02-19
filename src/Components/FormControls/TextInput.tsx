// src/Components/FormControls/TextInput.tsx
import React from 'react';
import { View, Text, TextInput as RNTextInput, StyleSheet } from 'react-native';
import { Controller } from 'react-hook-form';
import { BaseFieldProps, FieldStyles } from '../../types';

interface TextInputProps extends BaseFieldProps {
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  styles?: FieldStyles;
}

export const TextInput: React.FC<TextInputProps> = ({
  name,
  label,
  control,
  error,
  required,
  placeholder,
  secureTextEntry,
  keyboardType = 'default',
  styles = {},
  disabled,
}) => {
  const accessibilityLabel = `${label}${required ? ' *' : ''}`;
  
  return (
    <View style={[defaultStyles.container, styles.container]}>
      <Text 
        style={[defaultStyles.label, styles.label]}
        accessibilityLabel={accessibilityLabel}
      >
        {label} {required && '*'}
      </Text>
      <Controller
        name={name}
        control={control}
        rules={{ required: required }}
        render={({ field: { onChange, value } }) => (
          <RNTextInput
            testID={`input-${name}`}
            accessibilityLabel={accessibilityLabel}
            style={[defaultStyles.input, styles.input]}
            onChangeText={onChange}
            value={value || ''}
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            editable={!disabled}
          />
        )}
      />
      {error && (
        <Text 
          style={[defaultStyles.error, styles.error]}
          testID={`error-${name}`}
          accessibilityLabel={`Error: ${error}`}
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
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});

export default TextInput;