import React, { useState } from 'react';
import { useForm, DefaultValues } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  Text,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import Button from './Button';
import { FormFieldConfig } from '../types';

export interface CustomStyles {
  formContainer?: ViewStyle;
  headerContainer?: ViewStyle;
  headerText?: TextStyle;
}

export interface FormSection {
  title?: string;
  fields: FormFieldConfig[];
  layout?: React.ComponentType<any>;
  layoutProps?: any;
}

export interface DynamicFormProps<T extends Record<string, any>> {
  sections: FormSection[];
  initialValues?: DefaultValues<T>; // Change this to DefaultValues
  onSubmit: (data: T) => void | Promise<void>;
  formTitle?: string;
  buttonTitle?: string;
  cancelTitle?: string;
  onCancel?: () => void;
  customStyles?: CustomStyles;
  components?: Record<string, React.ComponentType<any>>;
  layouts?: Record<string, React.ComponentType<any>>;
}
function DynamicForm<T extends Record<string, any>>({
  sections,
  initialValues = {} as DefaultValues<T>, // Cast empty object as DefaultValues<T>
  onSubmit,
  formTitle = 'Form',
  buttonTitle = 'Submit',
  cancelTitle = 'Cancel',
  onCancel,
  customStyles = {},
  components = {},
  layouts = {},
}: DynamicFormProps<T>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // In DynamicForm.tsx, update the schema creation
  const schema = z.object(
    sections.reduce((acc: Record<string, any>, section) => {
      section.fields.forEach(field => {
        if (field.required && !field.validation) {
          acc[field.name] = z.string().min(1, 'Required');
        } else if (field.required && field.validation) {
          acc[field.name] = field.validation.min(1, 'Required');
        } else {
          acc[field.name] = field.validation || z.any();
        }
      });
      return acc;
    }, {})
  ).transform(data => data as T);

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  const onSubmitHandler = async (data: T) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await Promise.resolve(onSubmit(data));
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormFieldConfig) => {
    const Component = field.component || components[field.type];
    if (!Component) return null;

    return (
      <View 
        key={field.name}
        accessible={true}
        accessibilityLabel={field.label}
        accessibilityRole="none"
      >
        <Component
          name={field.name}
          label={field.label}
          control={control}
          error={errors[field.name]?.message}
          required={field.required}
          disabled={isSubmitting}
          {...field.props}
        />
      </View>
    );
  };

  const renderSection = (section: FormSection) => {
    const Layout = section.layout || layouts.default || View;

    return (
      <View 
        key={section.title}
        accessible={true}
        accessibilityLabel={section.title || 'Form section'}
        accessibilityRole="none"
      >
        {section.title && (
          <Text style={styles.sectionTitle}>{section.title}</Text>
        )}
        <Layout {...section.layoutProps}>
          {section.fields.map(renderField)}
        </Layout>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      {formTitle && (
        <View 
          style={[styles.headerContainer, customStyles.headerContainer]}
          accessible={true}
          accessibilityLabel={formTitle}
          accessibilityRole="header"
        >
          <Text style={[styles.headerText, customStyles.headerText]}>
            {formTitle}
          </Text>
        </View>
      )}

      <ScrollView
        contentContainerStyle={[styles.formContainer, customStyles.formContainer]}
      >
        {sections.map(renderSection)}
        {submitError && (
          <Text style={styles.errorText}>{submitError}</Text>
        )}
      </ScrollView>

      <Button
        onSubmitButtonPress={handleSubmit(onSubmitHandler)}
        buttonTitle={isSubmitting ? 'Submitting...' : buttonTitle}
        cancelTitle={cancelTitle}
        onCancel={onCancel}
        disabled={isSubmitting || Object.keys(errors).length > 0}
      />

      {isSubmitting && (
        <View 
          testID="loading-indicator"
          style={styles.loadingOverlay}
        >
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 24,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DynamicForm;