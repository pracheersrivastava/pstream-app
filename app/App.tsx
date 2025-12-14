/**
 * PStream App - Main entry point
 * Wraps the app with ThemeProvider for global dark theme support.
 *
 * @format
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { ThemeProvider } from './theme/ThemeProvider';
import { colors } from './theme/colors';
import RootNavigator from './navigation/RootNavigator';
import { QueryClient, QueryClientProvider, focusManager } from '@tanstack/react-query';
import { AppState } from 'react-native';

// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes default
      retry: 1,
    },
  },
});

// React Query focus manager hook-up for React Native
focusManager.setEventListener((handleFocus: (focused: boolean) => void) => {
  const subscription = AppState.addEventListener('change', status => {
    handleFocus(status === 'active');
  });
  return () => subscription.remove();
});

function App(): React.JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {/* Configure status bar for dark theme */}
        <StatusBar
          barStyle="light-content"
          backgroundColor={colors.BACKGROUND}
        />
        <RootNavigator />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
