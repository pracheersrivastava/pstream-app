/**
 * Environment configuration helpers.
 *
 * ============================================================================
 * SECURITY NOTICE (NON-NEGOTIABLE):
 * ============================================================================
 * This app NEVER communicates with the backend (port 3000) in any form.
 * All network traffic MUST go through the proxy (port 3003) ONLY.
 *
 * The BASE_API_URL is FIXED and cannot be changed at runtime.
 * ============================================================================
 */

import { getItem, STORAGE_KEYS } from '../store/storage';
import { BASE_API_URL } from './defaults';

/**
 * Get the currently configured P-Stream instance URL.
 *
 * @deprecated The API URL is now fixed. This function always returns BASE_API_URL.
 * @returns The fixed proxy URL (BASE_API_URL)
 */
export async function getCurrentInstance(): Promise<string> {
  return BASE_API_URL;
}

/**
 * Get the base API URL (proxy URL).
 * This is the ONLY entry point for all network traffic.
 *
 * @returns The fixed proxy URL
 */
export function getApiUrl(): string {
  return BASE_API_URL;
}

/**
 * Check if mock mode is currently enabled.
 * Mock mode is for development/testing when the proxy is unreachable.
 *
 * @returns True if mock mode is enabled
 */
export async function isMockModeEnabled(): Promise<boolean> {
  try {
    const mockMode = await getItem(STORAGE_KEYS.MOCK_MODE);
    return mockMode === 'true';
  } catch {
    return false;
  }
}
