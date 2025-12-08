/**
 * Environment configuration helpers.
 * Reads runtime configuration from storage.
 */
import { getItem, STORAGE_KEYS } from '../store/storage';
import { DEFAULT_INSTANCE } from './defaults';

/**
 * Get the currently configured P-Stream instance URL.
 * Falls back to DEFAULT_INSTANCE if none is saved.
 *
 * @returns The current instance URL
 */
export async function getCurrentInstance(): Promise<string> {
  try {
    const savedInstance = await getItem(STORAGE_KEYS.INSTANCE_URL);
    return savedInstance ?? DEFAULT_INSTANCE;
  } catch (error) {
    console.warn('[Config] Failed to read instance URL from storage:', error);
    return DEFAULT_INSTANCE;
  }
}

/**
 * Check if mock mode is currently enabled
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

