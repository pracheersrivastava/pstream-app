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

function App(): React.JSX.Element {
  return (
    <ThemeProvider>
      {/* Configure status bar for dark theme */}
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.BACKGROUND}
      />
      <RootNavigator />
    </ThemeProvider>
  );
}

export default App;
