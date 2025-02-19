// src/__tests__/Layout/Column.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import { Column } from '../../src/Components/Layout/Column';
import { View, Text } from 'react-native';

describe('Column', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <Column>
        <Text>Child 1</Text>
        <Text>Child 2</Text>
      </Column>
    );

    expect(getByText('Child 1')).toBeTruthy();
    expect(getByText('Child 2')).toBeTruthy();
  });

  it('applies default styles correctly', () => {
    const { UNSAFE_getByType } = render(
      <Column>
        <Text>Test Child</Text>
      </Column>
    );

    const columnContainer = UNSAFE_getByType(View);
    expect(columnContainer.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          flexDirection: 'column',
        })
      ])
    );
  });

  it('applies custom styles correctly', () => {
    const customStyle = {
      backgroundColor: 'blue',
      padding: 15,
    };

    const { UNSAFE_getByType } = render(
      <Column style={customStyle}>
        <Text>Test Child</Text>
      </Column>
    );

    const columnContainer = UNSAFE_getByType(View);
    expect(columnContainer.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining(customStyle)
      ])
    );
  });

  it('applies default spacing correctly', () => {
    const { UNSAFE_getByType } = render(
      <Column>
        <Text>Test Child</Text>
      </Column>
    );

    const columnContainer = UNSAFE_getByType(View);
    expect(columnContainer.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          marginVertical: -4, // default spacing (8) / 2
        })
      ])
    );
  });

  it('applies custom spacing correctly', () => {
    const customSpacing = 16;
    const { UNSAFE_getByType } = render(
      <Column spacing={customSpacing}>
        <Text>Test Child</Text>
      </Column>
    );

    const columnContainer = UNSAFE_getByType(View);
    expect(columnContainer.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          marginVertical: -customSpacing / 2,
        })
      ])
    );
  });

  it('wraps children with proper spacing', () => {
    const { UNSAFE_getAllByType } = render(
      <Column spacing={16}>
        <Text>Child 1</Text>
        <Text>Child 2</Text>
      </Column>
    );

    // Get all child View containers (excluding the main Column container)
    const childContainers = UNSAFE_getAllByType(View).slice(1);
    
    childContainers.forEach(container => {
      expect(container.props.style).toEqual(
        expect.objectContaining({
          paddingVertical: 8, // spacing (16) / 2
        })
      );
    });
  });

  it('handles single child correctly', () => {
    const { getByText, UNSAFE_getAllByType } = render(
      <Column>
        <Text>Single Child</Text>
      </Column>
    );

    expect(getByText('Single Child')).toBeTruthy();
    
    // Should still wrap the single child in a View with padding
    const childContainers = UNSAFE_getAllByType(View).slice(1);
    expect(childContainers).toHaveLength(1);
  });

  it('handles empty children correctly', () => {
    const { UNSAFE_getByType } = render(<Column />);

    const columnContainer = UNSAFE_getByType(View);
    expect(columnContainer).toBeTruthy();
    expect(columnContainer.props.children).toBeUndefined();
  });

  it('maintains vertical layout for multiple children', () => {
    const { UNSAFE_getAllByType } = render(
      <Column>
        <Text>Child 1</Text>
        <Text>Child 2</Text>
        <Text>Child 3</Text>
      </Column>
    );

    const childContainers = UNSAFE_getAllByType(View).slice(1);
    expect(childContainers).toHaveLength(3);
  });

  it('combines multiple style properties correctly', () => {
    const customStyle = {
      backgroundColor: 'blue',
      padding: 15,
    };

    const { UNSAFE_getByType } = render(
      <Column style={customStyle} spacing={16}>
        <Text>Test Child</Text>
      </Column>
    );

    const columnContainer = UNSAFE_getByType(View);
    expect(columnContainer.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          flexDirection: 'column',
        }),
        expect.objectContaining({
          marginVertical: -8,
        }),
        expect.objectContaining(customStyle),
      ])
    );
  });

  it('preserves child order', () => {
    const { getAllByText } = render(
      <Column>
        <Text>1</Text>
        <Text>2</Text>
        <Text>3</Text>
      </Column>
    );

    const numbers = getAllByText(/[123]/).map(element => element.props.children);
    expect(numbers).toEqual(['1', '2', '3']);
  });
});