/**
 * Border radius tokens for consistent rounded corners.
 * Used for cards, buttons, and interactive elements.
 */
export const radii = {
  /** Small radius - subtle rounding for buttons */
  sm: 6,
  /** Medium radius - cards and containers */
  md: 12,
  /** Large radius - prominent elements and modals */
  lg: 20,
} as const;

export type RadiusToken = keyof typeof radii;
export type RadiusValue = (typeof radii)[RadiusToken];

