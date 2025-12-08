/**
 * Themed utility components and HOC for simplified screen styling.
 * Provides consistent background and padding for screen containers.
 */
import React, { type ReactNode } from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import { useTheme } from './ThemeProvider';

interface ThemedScreenProps {
  /** Child components to render inside the themed container */
  children: ReactNode;
  /** Additional style overrides */
  style?: ViewStyle;
  /** Whether to apply default padding (defaults to true) */
  withPadding?: boolean;
}

/**
 * ThemedScreen - A wrapper component that applies theme background and padding.
 * Use this to wrap screen content for consistent styling.
 *
 * @example
 * ```tsx
 * const HomeScreen = () => (
 *   <ThemedScreen>
 *     <ThemedText variant="h1">Welcome</ThemedText>
 *   </ThemedScreen>
 * );
 * ```
 */
export const ThemedScreen: React.FC<ThemedScreenProps> = ({
  children,
  style,
  withPadding = true,
}) => {
  const { colors, spacing } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.BACKGROUND },
        withPadding && { padding: spacing.md },
        style,
      ]}>
      {children}
    </View>
  );
};

/**
 * ThemedCard - A card component with theme surface color and border radius.
 *
 * @example
 * ```tsx
 * <ThemedCard>
 *   <ThemedText>Card content</ThemedText>
 * </ThemedCard>
 * ```
 */
interface ThemedCardProps {
  children: ReactNode;
  style?: ViewStyle;
}

export const ThemedCard: React.FC<ThemedCardProps> = ({ children, style }) => {
  const { colors, spacing, radii } = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: colors.CARD,
          borderRadius: radii.md,
          padding: spacing.md,
        },
        style,
      ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ThemedScreen;

