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

import axios from 'axios';
import { setItem, removeItem, STORAGE_KEYS } from '../store/storage';
import { getCurrentInstance } from '../config/env';

/**
 * Get the currently configured instance URL.
 *
 * @returns Promise resolving to the current instance URL
 */
export async function getInstanceUrl(): Promise<string> {
  return getCurrentInstance();
}

/**
 * Set a new instance URL.
 *
 * @param url - The URL to set
 */
export async function setInstanceUrl(url: string): Promise<void> {
  // Normalize URL: remove trailing slash
  const normalizedUrl = url.replace(/\/+$/, '');
  await setItem(STORAGE_KEYS.INSTANCE_URL, normalizedUrl);
}

/**
 * Validate an instance URL by making a test request.
 * Checks if the URL points to a valid P-Stream proxy.
 *
 * @param url - The instance URL to validate
 * @returns Promise resolving to true if valid
 */
export async function validateInstanceUrl(url: string): Promise<boolean> {
  const normalizedUrl = url.replace(/\/+$/, '');

  try {
    // Check for forbidden backend port (3000)
    if (normalizedUrl.includes(':3000')) {
      return false;
    }

    // Try /meta endpoint first, fallback to /ping
    // We use a raw axios request to avoid the global client's interceptors
    // which might be bound to the old URL.
    await axios.get(`${normalizedUrl}/meta`, {
      timeout: 5000,
      validateStatus: (status) => status === 200,
    });

    return true;
  } catch {
    try {
      // Fallback to /ping
      await axios.get(`${normalizedUrl}/ping`, {
        timeout: 5000,
        validateStatus: (status) => status === 200,
      });
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Reset instance URL to the default value.
 */
export async function resetInstanceUrl(): Promise<void> {
  await removeItem(STORAGE_KEYS.INSTANCE_URL);
}

export default {
  getInstanceUrl,
  setInstanceUrl,
  validateInstanceUrl,
  resetInstanceUrl,
};
