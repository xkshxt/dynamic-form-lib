import { ViewStyle, TextStyle } from 'react-native';
import { Control } from 'react-hook-form';

export interface BaseFieldProps {
  name: string;
  label: string;
  control: Control<any>;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export interface FieldStyles {
  container?: ViewStyle;
  label?: TextStyle;
  error?: TextStyle;
  input?: ViewStyle;
  optionsContainer?: ViewStyle;
  option?: ViewStyle;
  selectedOption?: ViewStyle;
  radio?: ViewStyle;
  selected?: ViewStyle;
  optionLabel?: TextStyle;
}

export interface CustomComponentProps extends BaseFieldProps {
  component: React.ComponentType<any>;
  props?: any;
}

export interface Option {
  label: string;
  value: any;
}

export type FieldType = 'text' | 'dropdown' | 'checkbox' | 'radio' | 'toggle';

export interface FormFieldConfig {
  name: string;
  type: FieldType;
  label: string;
  required?: boolean;
  options?: Option[];
  validation?: any;
  disabled?: boolean;
  props?: Record<string, any>;
  component?: React.ComponentType<any>; // Add this line
}