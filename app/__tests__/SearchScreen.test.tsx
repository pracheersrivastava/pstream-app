/**
 * @format
 * Tests for SearchScreen
 */
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import SearchScreen from '../screens/SearchScreen';
import { ThemeProvider } from '../theme/ThemeProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.useFakeTimers();

jest.mock('../components/PosterCard', () => {
  const { View } = require('react-native');
  return ({ item }: { item: any }) => <View testID={`poster-${item?.id ?? 'x'}`} />;
});

jest.mock('../api/pstream', () => ({
  search: jest.fn(async (query: string) => [
    { id: '1', title: `Result for ${query}`, poster: null, overview: '', type: 'movie' },
  ]),
}));

const mockSearch = require('../api/pstream').search as jest.Mock;

const renderWithProviders = (ui: React.ReactNode) => {
  const client = new QueryClient();
  return render(
    <QueryClientProvider client={client}>
      <ThemeProvider>{ui}</ThemeProvider>
    </QueryClientProvider>,
  );
};

describe('SearchScreen', () => {
  it('renders idle state snapshot', () => {
    const screen = renderWithProviders(<SearchScreen />);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    const hint = screen.getByText('Find something to watch');
    expect({ hint: hint.props.children }).toMatchSnapshot();
  });

  it('debounces search calls', async () => {
    mockSearch.mockClear();
    const screen = renderWithProviders(<SearchScreen />);
    const input = screen.getByPlaceholderText('Search movies & shows');

    fireEvent.changeText(input, 's');
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(mockSearch).not.toHaveBeenCalled();

    fireEvent.changeText(input, 'star');
    act(() => {
      jest.advanceTimersByTime(299);
    });
    expect(mockSearch).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(1);
    });
    await waitFor(() => expect(mockSearch).toHaveBeenCalledTimes(1));
    expect(mockSearch).toHaveBeenCalledWith('star');
  });
});


