/**
 * Typography scale for consistent text styling.
 * Sizes are optimized for mobile readability.
 */
export const typography = {
  /** Font sizes in pixels */
  fontSize: {
    /** Heading 1 - largest heading */
    h1: 24,
    /** Heading 2 - section headings */
    h2: 20,
    /** Body text - default readable size */
    body: 16,
    /** Small text - captions and labels */
    small: 12,
  },
  /** Line heights for each font size (multiplier) */
  lineHeight: {
    h1: 32,
    h2: 28,
    body: 24,
    small: 16,
  },
} as const;

export type FontSizeToken = keyof typeof typography.fontSize;
export type FontSizeValue = (typeof typography.fontSize)[FontSizeToken];

