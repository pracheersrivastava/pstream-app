/**
 * ThemeProvider - React Context provider for theme tokens.
 * Wraps the app root to provide theme access to all components.
 */
import React, { createContext, useContext, type ReactNode } from 'react';
import { darkTheme, type Theme } from './index';

/**
 * Theme context - provides theme tokens to the component tree.
 * Default value is the dark theme.
 */
const ThemeContext = createContext<Theme>(darkTheme);

interface ThemeProviderProps {
  /** Child components that will have access to theme */
  children: ReactNode;
  /** Optional custom theme override (defaults to darkTheme) */
  theme?: Theme;
}

/**
 * ThemeProvider component.
 * Wrap your app root with this to enable useTheme() throughout the app.
 *
 * @example
 * ```tsx
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  theme = darkTheme,
}) => {
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

/**
 * useTheme hook - access theme tokens in any component.
 *
 * @returns Theme object containing colors, spacing, typography, and radii
 *
 * @example
 * ```tsx
 * const { colors, spacing } = useTheme();
 * const styles = StyleSheet.create({
 *   container: {
 *     backgroundColor: colors.BACKGROUND,
 *     padding: spacing.md,
 *   },
 * });
 * ```
 */
export const useTheme = (): Theme => {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return theme;
};

export default ThemeProvider;

