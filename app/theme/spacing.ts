/**
 * Spacing scale for consistent layout throughout the app.
 * Based on a 4px base unit for visual harmony.
 */
export const spacing = {
  /** Extra small spacing - 4px */
  xs: 4,
  /** Small spacing - 8px */
  sm: 8,
  /** Medium spacing - 16px (default) */
  md: 16,
  /** Large spacing - 24px */
  lg: 24,
  /** Extra large spacing - 32px */
  xl: 32,
} as const;

export type SpacingToken = keyof typeof spacing;
export type SpacingValue = (typeof spacing)[SpacingToken];

