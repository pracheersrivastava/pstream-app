/**
 * SettingsService - DEPRECATED
 *
 * ============================================================================
 * SECURITY NOTICE (NON-NEGOTIABLE):
 * ============================================================================
 * This app NEVER communicates with the backend (port 3000) in any form.
 * All network traffic MUST go through the proxy (port 3003) ONLY.
 *
 * The BASE_API_URL is now FIXED and cannot be changed at runtime.
 * This service is maintained for backwards compatibility only.
 * ============================================================================
 */

import { BASE_API_URL } from '../config/defaults';

/**
 * Get the currently configured instance URL.
 *
 * @deprecated The API URL is now fixed. This function always returns BASE_API_URL.
 * @returns Promise resolving to BASE_API_URL
 */
export async function getInstanceUrl(): Promise<string> {
  return BASE_API_URL;
}

/**
 * Set a new instance URL.
 *
 * @deprecated Instance URL changes are no longer supported.
 * The app uses a fixed BASE_API_URL for security reasons.
 * This function is a no-op.
 *
 * @param _url - The URL to set (ignored)
 */
export async function setInstanceUrl(_url: string): Promise<void> {
  if (__DEV__) {
    console.warn(
      '[SettingsService] setInstanceUrl is deprecated. ' +
        'The app uses a fixed proxy URL and does not support changing instances.',
    );
  }
  // No-op: we no longer allow changing the instance URL
}

/**
 * Validate an instance URL by making a test request.
 *
 * @deprecated Instance URL validation is no longer supported.
 * This function always returns true for the fixed BASE_API_URL,
 * false for any other URL.
 *
 * @param url - The instance URL to validate
 * @returns Promise resolving to true if url matches BASE_API_URL
 */
export async function validateInstanceUrl(url: string): Promise<boolean> {
  const normalizedUrl = url.replace(/\/+$/, '');

  if (normalizedUrl === BASE_API_URL) {
    return true;
  }

  if (__DEV__) {
    console.warn(
      '[SettingsService] validateInstanceUrl is deprecated. ' +
        `Only the fixed proxy URL (${BASE_API_URL}) is valid.`,
    );
  }

  return false;
}

/**
 * Reset instance URL to the default value.
 *
 * @deprecated The instance URL is now fixed and cannot be changed.
 * This function is a no-op.
 */
export async function resetInstanceUrl(): Promise<void> {
  if (__DEV__) {
    console.warn(
      '[SettingsService] resetInstanceUrl is deprecated. ' +
        'The app uses a fixed proxy URL.',
    );
  }
  // No-op
}

export default {
  getInstanceUrl,
  setInstanceUrl,
  validateInstanceUrl,
  resetInstanceUrl,
};
