/**
 * DynamicForm Component with Schema Validation
 */

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  Text,
  Alert,
  ViewStyle,
  TextStyle,
} from 'react-native';
import FormButtonComponent from './FormButtonComponent';

/** Custom style interface */
export interface CustomStyles {
  formContainer?: ViewStyle;
  headerContainer?: ViewStyle;
  headerText?: TextStyle;
}

/** Define TypeScript Interface for Form Fields */
interface FormValues {
  name: string;
  age: number;
  email: string;
  hobbies: string[];
}

/** Define Zod Schema for Validation */
const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.number().min(18, 'Age must be 18 or above'),
  email: z.string().email('Invalid email address'),
  hobbies: z.array(z.string()).min(1, 'At least one hobby is required'),
});

export interface DynamicFormProps {
  initialValues?: Partial<FormValues>;
  onSubmit: (data: FormValues) => void;
  formTitle?: string;
  buttonTitle?: string;
  cancelTitle?: string;
  onCancel?: () => void;
  children: React.ReactNode;
  customStyles?: CustomStyles;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  initialValues = {},
  onSubmit,
  formTitle = 'Form',
  buttonTitle = 'Submit',
  cancelTitle = 'Cancel',
  onCancel,
  children,
  customStyles = {},
}) => {
  // Initialize react-hook-form with Zod resolver
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialValues as FormValues, // Fix type issue here
  });

  /** Handles form submission */
  const onSubmitHandler = (data: FormValues) => {
    onSubmit(data);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      style={{ flex: 1 }}
    >
      {/* Render header */}
      {formTitle && (
        <View style={[styles.headerContainer, customStyles.headerContainer || {}]}>
          <Text testID='FormTitle' style={[styles.headerText, customStyles.headerText || {}]}>
            {formTitle}
          </Text>
        </View>
      )}

      {/* Render form fields */}
      <ScrollView contentContainerStyle={[styles.formContainer, customStyles.formContainer || {}]}>
        {children}

        {/* Display Error Messages */}
        {errors.name && <Text style={styles.errorText}>{errors.name.message as string}</Text>}
        {errors.age && <Text style={styles.errorText}>{errors.age.message as string}</Text>}
        {errors.email && <Text style={styles.errorText}>{errors.email.message as string}</Text>}
        {errors.hobbies && <Text style={styles.errorText}>{errors.hobbies.message as string}</Text>}
      </ScrollView>

      {/* Render form buttons */}
      <FormButtonComponent
        onSubmitButtonPress={handleSubmit(onSubmitHandler)}
        buttonTitle={buttonTitle}
        cancelTitle={cancelTitle}
        onCancel={onCancel}
        disabled={Object.keys(errors).length > 0}
      />
    </KeyboardAvoidingView>
  );
};

export default DynamicForm;

// Define styles
const styles = StyleSheet.create({
  formContainer: {
    flexGrow: 1,
    padding: 16,
  },
  headerContainer: {
    padding: 16,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
});
