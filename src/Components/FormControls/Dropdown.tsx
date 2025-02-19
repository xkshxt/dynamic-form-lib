import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Controller } from 'react-hook-form';
import { BaseFieldProps, FieldStyles } from '../../types';

interface DropdownProps extends BaseFieldProps {
  options: { label: string; value: any }[];
  styles?: FieldStyles;
}

export const Dropdown: React.FC<DropdownProps> = ({
  name,
  label,
  control,
  error,
  required,
  options,
  styles = {},
  disabled,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View style={[defaultStyles.container, styles.container]}>
      <Text style={[defaultStyles.label, styles.label]}>
        {label} {required && '*'}
      </Text>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <>
            <TouchableOpacity
              style={[defaultStyles.dropdown, styles.input]}
              onPress={() => !disabled && setIsVisible(true)}
            >
              <Text>
                {options.find(option => option.value === value)?.label || 'Select...'}
              </Text>
            </TouchableOpacity>
            <Modal visible={isVisible} animationType="slide" transparent>
              <View style={defaultStyles.modalContainer}>
                <View style={defaultStyles.modalContent}>
                  {options.map(option => (
                    <TouchableOpacity
                      key={option.value}
                      style={defaultStyles.option}
                      onPress={() => {
                        onChange(option.value);
                        setIsVisible(false);
                      }}
                    >
                      <Text>{option.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </Modal>
          </>
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
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  option: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});