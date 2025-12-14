/**
 * @format
 * Integration test for HomeScreen rendering with mocked fetchHome
 */
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import HomeScreen from '../screens/HomeScreen';
import { ThemeProvider } from '../theme/ThemeProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock pstream fetchHome
jest.mock('../api/pstream', () => ({
  fetchHome: jest.fn(async () => [
    { id: '1', title: 'Hero Title', poster: null, overview: 'Hero overview', type: 'movie' },
    { id: '2', title: 'Item 2', poster: null, overview: '...', type: 'movie' },
    { id: '3', title: 'Item 3', poster: null, overview: '...', type: 'movie' },
    { id: '4', title: 'Item 4', poster: null, overview: '...', type: 'movie' },
  ]),
  fetchDetails: jest.fn(async () => ({ id: '1', title: 'Details', poster: null, overview: '', type: 'movie' })),
}));

const createTestWrapper = (ui: React.ReactNode) => {
  const client = new QueryClient();
  return render(
    <QueryClientProvider client={client}>
      <ThemeProvider>{ui}</ThemeProvider>
    </QueryClientProvider>,
  );
};

describe('HomeScreen (integration)', () => {
  it('renders hero and a carousel title', async () => {
    const screen = createTestWrapper(<HomeScreen />);

    await waitFor(() => {
      // Expect hero title rendered
      expect(screen.getByText('Hero Title')).toBeTruthy();
    });

    // One of the carousel titles
    expect(screen.getByText('Trending')).toBeTruthy();
  });
});


