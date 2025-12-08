/**
 * ThemedView - A View component that applies theme background by default.
 * Use for containers that need consistent theme styling.
 */
import React, { type ReactNode } from 'react';
import { View, StyleSheet, type ViewStyle, type ViewProps } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

type BackgroundVariant = 'background' | 'surface' | 'card';

interface ThemedViewProps extends ViewProps {
  /** Child components */
  children?: ReactNode;
  /** Background color variant (defaults to 'background') */
  variant?: BackgroundVariant;
  /** Additional style overrides */
  style?: ViewStyle;
}

/**
 * ThemedView component.
 * Automatically applies theme background colors based on variant.
 *
 * @example
 * ```tsx
 * // Default background
 * <ThemedView>
 *   <Text>Content</Text>
 * </ThemedView>
 *
 * // Card variant
 * <ThemedView variant="card" style={{ padding: 16 }}>
 *   <Text>Card content</Text>
 * </ThemedView>
 * ```
 */
export const ThemedView: React.FC<ThemedViewProps> = ({
  children,
  variant = 'background',
  style,
  ...props
}) => {
  const { colors } = useTheme();

  const backgroundColors: Record<BackgroundVariant, string> = {
    background: colors.BACKGROUND,
    surface: colors.SURFACE,
    card: colors.CARD,
  };

  return (
    <View
      style={[styles.base, { backgroundColor: backgroundColors[variant] }, style]}
      {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    // Base styles can be extended as needed
  },
});

export default ThemedView;

