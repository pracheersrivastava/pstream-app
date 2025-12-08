/**
 * Theme module entry point.
 * Exports all theme tokens and the default dark theme object.
 */
import { colors, type ColorToken, type ColorValue } from './colors';
import { spacing, type SpacingToken, type SpacingValue } from './spacing';
import {
  typography,
  type FontSizeToken,
  type FontSizeValue,
} from './typography';
import { radii, type RadiusToken, type RadiusValue } from './radii';

/**
 * Complete theme object containing all design tokens.
 */
export interface Theme {
  colors: typeof colors;
  spacing: typeof spacing;
  typography: typeof typography;
  radii: typeof radii;
}

/**
 * Default dark theme for the pstream app.
 * This is the primary theme used throughout the application.
 */
export const darkTheme: Theme = {
  colors,
  spacing,
  typography,
  radii,
};

// Re-export individual token modules for direct access
export { colors, spacing, typography, radii };

// Re-export types for use in components
export type {
  ColorToken,
  ColorValue,
  SpacingToken,
  SpacingValue,
  FontSizeToken,
  FontSizeValue,
  RadiusToken,
  RadiusValue,
};

