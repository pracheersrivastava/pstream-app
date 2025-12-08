/**
 * SettingsService - Manages app settings including instance URL.
 * Provides methods to get, set, and validate P-Stream instance URLs.
 */
import axios from 'axios';
import { getItem, setItem, STORAGE_KEYS } from '../store/storage';
import { DEFAULT_INSTANCE, API_TIMEOUT } from '../config/defaults';

/**
 * Get the currently configured instance URL.
 * Falls back to DEFAULT_INSTANCE if none is saved.
 *
 * @returns Promise resolving to the current instance URL
 */
export async function getInstanceUrl(): Promise<string> {
  try {
    const savedUrl = await getItem(STORAGE_KEYS.INSTANCE_URL);
    return savedUrl ?? DEFAULT_INSTANCE;
  } catch (error) {
    console.warn('[SettingsService] Failed to get instance URL:', error);
    return DEFAULT_INSTANCE;
  }
}

/**
 * Set a new instance URL.
 * This will be used for all subsequent API calls.
 *
 * @param url - The new instance URL to save
 */
export async function setInstanceUrl(url: string): Promise<void> {
  // Normalize URL - remove trailing slash
  const normalizedUrl = url.replace(/\/+$/, '');

  await setItem(STORAGE_KEYS.INSTANCE_URL, normalizedUrl);
  console.log('[SettingsService] Instance URL updated:', normalizedUrl);
}

/**
 * Expected shape of the /backend/home response for validation
 */
interface HomeValidationResponse {
  items?: unknown[];
  [key: string]: unknown;
}

/**
 * Validate an instance URL by making a test request.
 * Checks if the server responds with the expected structure.
 *
 * @param url - The instance URL to validate
 * @returns Promise resolving to true if valid, false otherwise
 */
export async function validateInstanceUrl(url: string): Promise<boolean> {
  try {
    // Normalize URL
    const normalizedUrl = url.replace(/\/+$/, '');
    const testEndpoint = `${normalizedUrl}/backend/home`;

    console.log('[SettingsService] Validating instance:', testEndpoint);

    const response = await axios.get<HomeValidationResponse>(testEndpoint, {
      timeout: API_TIMEOUT,
      headers: {
        'Accept': 'application/json',
      },
    });

    // Check for successful status
    if (response.status !== 200) {
      console.warn('[SettingsService] Validation failed: non-200 status');
      return false;
    }

    // Check for expected response structure (items array present)
    const data = response.data;
    if (data && Array.isArray(data.items)) {
      console.log('[SettingsService] Validation successful');
      return true;
    }

    // Also accept if data is directly an array (some backends return items directly)
    if (Array.isArray(data)) {
      console.log('[SettingsService] Validation successful (array response)');
      return true;
    }

    console.warn('[SettingsService] Validation failed: unexpected response structure');
    return false;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        console.warn('[SettingsService] Validation failed: timeout');
      } else if (error.response) {
        console.warn(
          '[SettingsService] Validation failed: server error',
          error.response.status,
        );
      } else {
        console.warn('[SettingsService] Validation failed: network error');
      }
    } else {
      console.warn('[SettingsService] Validation failed:', error);
    }
    return false;
  }
}

/**
 * Reset instance URL to the default value.
 */
export async function resetInstanceUrl(): Promise<void> {
  await setItem(STORAGE_KEYS.INSTANCE_URL, DEFAULT_INSTANCE);
  console.log('[SettingsService] Instance URL reset to default');
}

export default {
  getInstanceUrl,
  setInstanceUrl,
  validateInstanceUrl,
  resetInstanceUrl,
};

