/**
 * Color tokens for the pstream app dark theme.
 * All colors are designed for optimal contrast on dark backgrounds.
 */
export const colors = {
  /** Main app background color - darkest shade */
  BACKGROUND: '#0B0F12',
  /** Surface color for elevated elements */
  SURFACE: '#0F1417',
  /** Card background color */
  CARD: '#111418',
  /** Muted/disabled state color */
  MUTED: '#6B7280',
  /** Primary brand color - used for CTAs and links */
  PRIMARY: '#1D76DB',
  /** Accent color - used for highlights and notifications */
  ACCENT: '#E36209',
  /** Primary text color - high contrast for readability */
  TEXT_PRIMARY: '#E6EEF3',
  /** Secondary text color - lower emphasis content */
  TEXT_SECONDARY: '#9AA6AD',
  /** Success state color */
  SUCCESS: '#0E8A16',
  /** Warning state color */
  WARNING: '#FBCA04',
  /** Error/danger state color */
  ERROR: '#D73A4A',
} as const;

export type ColorToken = keyof typeof colors;
export type ColorValue = (typeof colors)[ColorToken];

