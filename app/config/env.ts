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
 * @returns The configured proxy URL or default
 */
export async function getCurrentInstance(): Promise<string> {
  try {
    const stored = await getItem(STORAGE_KEYS.INSTANCE_URL);
    return stored || BASE_API_URL;
  } catch {
    return BASE_API_URL;
  }
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
