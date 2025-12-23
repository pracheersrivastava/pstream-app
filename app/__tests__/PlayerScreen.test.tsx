import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import PlayerScreen from '../screens/PlayerScreen';
import { ThemeProvider } from '../theme/ThemeProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock navigation
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: mockGoBack,
  }),
  useRoute: () => ({
    params: {
      tmdbId: '123',
      type: 'movie',
      title: 'Test Movie',
    },
  }),
}));

// Mock API
jest.mock('../api/pstream', () => ({
  fetchSources: jest.fn(async () => ({
    sources: [
      { url: 'http://test.com/video.m3u8', quality: '1080p', provider: 'Test', type: 'hls' },
      { url: 'http://test.com/video_720.m3u8', quality: '720p', provider: 'Test', type: 'hls' },
    ],
    subtitles: [],
  })),
}));

// Mock Video component
jest.mock('react-native-video', () => {
  const MockReact = require('react');
  const { View } = require('react-native');
  return MockReact.forwardRef((props: any, _ref: any) => {
    return <View testID="video-player" {...props} />;
  });
});

const createTestWrapper = (ui: React.ReactNode) => {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return render(
    <QueryClientProvider client={client}>
      <ThemeProvider>{ui}</ThemeProvider>
    </QueryClientProvider>,
  );
};

describe('PlayerScreen', () => {
  it('renders video player and controls', async () => {
    const screen = createTestWrapper(<PlayerScreen />);

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.getByTestId('video-player')).toBeTruthy();
    });

    // Check title
    expect(screen.getByText('Test Movie')).toBeTruthy();
    
    // Check controls
    expect(screen.getByText('⚙ Quality')).toBeTruthy();
  });

  it('shows quality modal on press', async () => {
    const screen = createTestWrapper(<PlayerScreen />);

    await waitFor(() => {
      expect(screen.getByTestId('video-player')).toBeTruthy();
    });

    const qualityButton = screen.getByText('⚙ Quality');
    fireEvent.press(qualityButton);

    await waitFor(() => {
      expect(screen.getByText('Select Quality')).toBeTruthy();
      expect(screen.getByText('1080p (Test)')).toBeTruthy();
    });
  });
});
