// src/Components/Layout/Row.tsx
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface RowProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  spacing?: number;
}

export const Row: React.FC<RowProps> = ({ children, style, spacing = 8 }) => {
  return (
    <View
      style={[
        styles.row,
        {
          marginHorizontal: -spacing / 2,
        },
        style,
      ]}
    >
      {React.Children.map(children, child => (
        <View style={{ paddingHorizontal: spacing / 2 }}>{child}</View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});