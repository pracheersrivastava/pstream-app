/**
 * @format
 * Unit tests for ThemedView component
 */

import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
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
  it('renders correctly with default background variant', async () => {
    let tree: ReturnType<ReactTestRenderer.ReactTestRenderer['toJSON']> = null;
    await act(async () => {
      tree = ReactTestRenderer.create(
        <TestWrapper>
          <ThemedView>
            <Text>Content</Text>
          </ThemedView>
        </TestWrapper>,
      ).toJSON();
    });

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with surface variant', async () => {
    let tree: ReturnType<ReactTestRenderer.ReactTestRenderer['toJSON']> = null;
    await act(async () => {
      tree = ReactTestRenderer.create(
        <TestWrapper>
          <ThemedView variant="surface">
            <Text>Surface Content</Text>
          </ThemedView>
        </TestWrapper>,
      ).toJSON();
    });

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with card variant', async () => {
    let tree: ReturnType<ReactTestRenderer.ReactTestRenderer['toJSON']> = null;
    await act(async () => {
      tree = ReactTestRenderer.create(
        <TestWrapper>
          <ThemedView variant="card">
            <Text>Card Content</Text>
          </ThemedView>
        </TestWrapper>,
      ).toJSON();
    });

    expect(tree).toMatchSnapshot();
  });

  it('applies custom styles correctly', async () => {
    const customStyle = { padding: 20, margin: 10 };
    let tree: ReturnType<ReactTestRenderer.ReactTestRenderer['toJSON']> = null;
    await act(async () => {
      tree = ReactTestRenderer.create(
        <TestWrapper>
          <ThemedView style={customStyle}>
            <Text>Styled Content</Text>
          </ThemedView>
        </TestWrapper>,
      ).toJSON();
    });

    expect(tree).toMatchSnapshot();
  });

  it('renders without children', async () => {
    let tree: ReturnType<ReactTestRenderer.ReactTestRenderer['toJSON']> = null;
    await act(async () => {
      tree = ReactTestRenderer.create(
        <TestWrapper>
          <ThemedView />
        </TestWrapper>,
      ).toJSON();
    });

    expect(tree).toMatchSnapshot();
  });
});

