// src/__tests__/Layout/Row.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import { Row } from '../../src/Components/Layout/Row';
import { View, Text } from 'react-native';

describe('Row', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <Row>
        <Text>Child 1</Text>
        <Text>Child 2</Text>
      </Row>
    );

    expect(getByText('Child 1')).toBeTruthy();
    expect(getByText('Child 2')).toBeTruthy();
  });

  it('applies default styles correctly', () => {
    const { UNSAFE_getByType } = render(
      <Row>
        <Text>Test Child</Text>
      </Row>
    );

    const rowContainer = UNSAFE_getByType(View);
    expect(rowContainer.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          flexDirection: 'row',
          flexWrap: 'wrap',
        })
      ])
    );
  });

  it('applies custom styles correctly', () => {
    const customStyle = {
      backgroundColor: 'red',
      padding: 10,
    };

    const { UNSAFE_getByType } = render(
      <Row style={customStyle}>
        <Text>Test Child</Text>
      </Row>
    );

    const rowContainer = UNSAFE_getByType(View);
    expect(rowContainer.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining(customStyle)
      ])
    );
  });

  it('applies default spacing correctly', () => {
    const { UNSAFE_getByType } = render(
      <Row>
        <Text>Test Child</Text>
      </Row>
    );

    const rowContainer = UNSAFE_getByType(View);
    expect(rowContainer.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          marginHorizontal: -4, // default spacing (8) / 2
        })
      ])
    );
  });

  it('applies custom spacing correctly', () => {
    const customSpacing = 16;
    const { UNSAFE_getByType } = render(
      <Row spacing={customSpacing}>
        <Text>Test Child</Text>
      </Row>
    );

    const rowContainer = UNSAFE_getByType(View);
    expect(rowContainer.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          marginHorizontal: -customSpacing / 2,
        })
      ])
    );
  });

  it('wraps children with proper spacing', () => {
    const { UNSAFE_getAllByType } = render(
      <Row spacing={16}>
        <Text>Child 1</Text>
        <Text>Child 2</Text>
      </Row>
    );

    // Get all child View containers (excluding the main Row container)
    const childContainers = UNSAFE_getAllByType(View).slice(1);
    
    childContainers.forEach(container => {
      expect(container.props.style).toEqual(
        expect.objectContaining({
          paddingHorizontal: 8, // spacing (16) / 2
        })
      );
    });
  });

  it('handles single child correctly', () => {
    const { getByText, UNSAFE_getAllByType } = render(
      <Row>
        <Text>Single Child</Text>
      </Row>
    );

    expect(getByText('Single Child')).toBeTruthy();
    
    // Should still wrap the single child in a View with padding
    const childContainers = UNSAFE_getAllByType(View).slice(1);
    expect(childContainers).toHaveLength(1);
  });

  it('handles empty children correctly', () => {
    const { UNSAFE_getByType } = render(<Row />);

    const rowContainer = UNSAFE_getByType(View);
    expect(rowContainer).toBeTruthy();
    expect(rowContainer.props.children).toBeUndefined();
  });

  it('combines multiple style properties correctly', () => {
    const customStyle = {
      backgroundColor: 'red',
      padding: 10,
    };

    const { UNSAFE_getByType } = render(
      <Row style={customStyle} spacing={16}>
        <Text>Test Child</Text>
      </Row>
    );

    const rowContainer = UNSAFE_getByType(View);
    expect(rowContainer.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          flexDirection: 'row',
          flexWrap: 'wrap',
        }),
        expect.objectContaining({
          marginHorizontal: -8,
        }),
        expect.objectContaining(customStyle),
      ])
    );
  });
});