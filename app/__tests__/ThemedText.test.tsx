/**
 * @format
 * Unit tests for ThemedText component
 */

import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { ThemedText } from '../components/ThemedText';
import { ThemeProvider } from '../theme/ThemeProvider';

/**
 * Wrapper component to provide theme context for tests
 */
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('ThemedText', () => {
  it('renders correctly with default props', async () => {
    let tree: ReturnType<ReactTestRenderer.ReactTestRenderer['toJSON']> = null;
    await act(async () => {
      tree = ReactTestRenderer.create(
        <TestWrapper>
          <ThemedText>Hello World</ThemedText>
        </TestWrapper>,
      ).toJSON();
    });

    expect(tree).toMatchSnapshot();
  });

  it('renders h1 variant correctly', async () => {
    let tree: ReturnType<ReactTestRenderer.ReactTestRenderer['toJSON']> = null;
    await act(async () => {
      tree = ReactTestRenderer.create(
        <TestWrapper>
          <ThemedText variant="h1">Heading 1</ThemedText>
        </TestWrapper>,
      ).toJSON();
    });

    expect(tree).toMatchSnapshot();
  });

  it('renders h2 variant correctly', async () => {
    let tree: ReturnType<ReactTestRenderer.ReactTestRenderer['toJSON']> = null;
    await act(async () => {
      tree = ReactTestRenderer.create(
        <TestWrapper>
          <ThemedText variant="h2">Heading 2</ThemedText>
        </TestWrapper>,
      ).toJSON();
    });

    expect(tree).toMatchSnapshot();
  });

  it('renders small variant correctly', async () => {
    let tree: ReturnType<ReactTestRenderer.ReactTestRenderer['toJSON']> = null;
    await act(async () => {
      tree = ReactTestRenderer.create(
        <TestWrapper>
          <ThemedText variant="small">Small text</ThemedText>
        </TestWrapper>,
      ).toJSON();
    });

    expect(tree).toMatchSnapshot();
  });

  it('applies secondary color correctly', async () => {
    let tree: ReturnType<ReactTestRenderer.ReactTestRenderer['toJSON']> = null;
    await act(async () => {
      tree = ReactTestRenderer.create(
        <TestWrapper>
          <ThemedText color="secondary">Secondary text</ThemedText>
        </TestWrapper>,
      ).toJSON();
    });

    expect(tree).toMatchSnapshot();
  });

  it('applies accent color correctly', async () => {
    let tree: ReturnType<ReactTestRenderer.ReactTestRenderer['toJSON']> = null;
    await act(async () => {
      tree = ReactTestRenderer.create(
        <TestWrapper>
          <ThemedText color="accent">Accent text</ThemedText>
        </TestWrapper>,
      ).toJSON();
    });

    expect(tree).toMatchSnapshot();
  });

  it('applies error color correctly', async () => {
    let tree: ReturnType<ReactTestRenderer.ReactTestRenderer['toJSON']> = null;
    await act(async () => {
      tree = ReactTestRenderer.create(
        <TestWrapper>
          <ThemedText color="error">Error text</ThemedText>
        </TestWrapper>,
      ).toJSON();
    });

    expect(tree).toMatchSnapshot();
  });

  it('applies custom styles correctly', async () => {
    const customStyle = { textAlign: 'center' as const };
    let tree: ReturnType<ReactTestRenderer.ReactTestRenderer['toJSON']> = null;
    await act(async () => {
      tree = ReactTestRenderer.create(
        <TestWrapper>
          <ThemedText style={customStyle}>Styled text</ThemedText>
        </TestWrapper>,
      ).toJSON();
    });

    expect(tree).toMatchSnapshot();
  });

  it('passes additional props to underlying Text component', async () => {
    let tree: ReturnType<ReactTestRenderer.ReactTestRenderer['toJSON']> = null;
    await act(async () => {
      tree = ReactTestRenderer.create(
        <TestWrapper>
          <ThemedText numberOfLines={2} ellipsizeMode="tail">
            This is a long text that should be truncated after two lines
          </ThemedText>
        </TestWrapper>,
      ).toJSON();
    });

    expect(tree).toMatchSnapshot();
  });
});

