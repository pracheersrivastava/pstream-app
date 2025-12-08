/**
 * ThemedText - A Text component that uses theme colors and typography.
 * Provides consistent text styling throughout the app.
 */
import React, { type ReactNode } from 'react';
import { Text, StyleSheet, type TextStyle, type TextProps } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

type TextVariant = 'h1' | 'h2' | 'body' | 'small';
type TextColor = 'primary' | 'secondary' | 'muted' | 'accent' | 'error' | 'success';

interface ThemedTextProps extends TextProps {
  /** Text content */
  children: ReactNode;
  /** Typography variant (defaults to 'body') */
  variant?: TextVariant;
  /** Text color variant (defaults to 'primary') */
  color?: TextColor;
  /** Additional style overrides */
  style?: TextStyle;
}

/**
 * ThemedText component.
 * Automatically applies theme typography and colors.
 *
 * @example
 * ```tsx
 * // Heading
 * <ThemedText variant="h1">Welcome to PStream</ThemedText>
 *
 * // Secondary text
 * <ThemedText variant="body" color="secondary">
 *   Browse your favorite content
 * </ThemedText>
 *
 * // Small muted text
 * <ThemedText variant="small" color="muted">
 *   Last updated: 2 hours ago
 * </ThemedText>
 * ```
 */
export const ThemedText: React.FC<ThemedTextProps> = ({
  children,
  variant = 'body',
  color = 'primary',
  style,
  ...props
}) => {
  const { colors, typography } = useTheme();

  const colorMap: Record<TextColor, string> = {
    primary: colors.TEXT_PRIMARY,
    secondary: colors.TEXT_SECONDARY,
    muted: colors.MUTED,
    accent: colors.ACCENT,
    error: colors.ERROR,
    success: colors.SUCCESS,
  };

  const variantStyles: Record<TextVariant, TextStyle> = {
    h1: {
      fontSize: typography.fontSize.h1,
      lineHeight: typography.lineHeight.h1,
      fontWeight: 'bold',
    },
    h2: {
      fontSize: typography.fontSize.h2,
      lineHeight: typography.lineHeight.h2,
      fontWeight: '600',
    },
    body: {
      fontSize: typography.fontSize.body,
      lineHeight: typography.lineHeight.body,
      fontWeight: 'normal',
    },
    small: {
      fontSize: typography.fontSize.small,
      lineHeight: typography.lineHeight.small,
      fontWeight: 'normal',
    },
  };

  return (
    <Text
      style={[
        styles.base,
        variantStyles[variant],
        { color: colorMap[color] },
        style,
      ]}
      {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    // Base text styles
  },
});

export default ThemedText;

