/**
 * @format
 * Unit tests for ThemedView component
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Text } from 'react-native';
import { ThemedView } from '../components/ThemedView';
import { ThemeProvider } from '../theme/ThemeProvider';

/**
 * Wrapper component to provide theme context for tests
 */
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('ThemedView', () => {
  it('renders correctly with default background variant', () => {
    const tree = ReactTestRenderer.create(
      <TestWrapper>
        <ThemedView>
          <Text>Content</Text>
        </ThemedView>
      </TestWrapper>,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with surface variant', () => {
    const tree = ReactTestRenderer.create(
      <TestWrapper>
        <ThemedView variant="surface">
          <Text>Surface Content</Text>
        </ThemedView>
      </TestWrapper>,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with card variant', () => {
    const tree = ReactTestRenderer.create(
      <TestWrapper>
        <ThemedView variant="card">
          <Text>Card Content</Text>
        </ThemedView>
      </TestWrapper>,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('applies custom styles correctly', () => {
    const customStyle = { padding: 20, margin: 10 };
    const tree = ReactTestRenderer.create(
      <TestWrapper>
        <ThemedView style={customStyle}>
          <Text>Styled Content</Text>
        </ThemedView>
      </TestWrapper>,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders without children', () => {
    const tree = ReactTestRenderer.create(
      <TestWrapper>
        <ThemedView />
      </TestWrapper>,
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});

