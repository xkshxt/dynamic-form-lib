// src/Components/Layout/Column.tsx
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface ColumnProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  spacing?: number;
}

export const Column: React.FC<ColumnProps> = ({ children, style, spacing = 8 }) => {
  return (
    <View
      style={[
        styles.column,
        {
          marginVertical: -spacing / 2,
        },
        style,
      ]}
    >
      {React.Children.map(children, child => (
        <View style={{ paddingVertical: spacing / 2 }}>{child}</View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  column: {
    flexDirection: 'column',
  },
});