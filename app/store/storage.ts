/**
 * Storage abstraction layer.
 * Primary: react-native-mmkv for performance
 * Fallback: AsyncStorage for CI/dev environments
 *
 * Provides a unified async API regardless of underlying storage.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage interface for consistent API
export interface StorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

// MMKV storage implementation (if available)
let mmkvStorage: StorageAdapter | null = null;

try {
  // Dynamic import to handle environments where MMKV isn't available
  const { MMKV } = require('react-native-mmkv');
  const mmkv = new MMKV();

  mmkvStorage = {
    getItem: async (key: string): Promise<string | null> => {
      return mmkv.getString(key) ?? null;
    },
    setItem: async (key: string, value: string): Promise<void> => {
      mmkv.set(key, value);
    },
    removeItem: async (key: string): Promise<void> => {
      mmkv.delete(key);
    },
  };

  console.log('[Storage] Using MMKV storage');
} catch {
  console.log('[Storage] MMKV not available, using AsyncStorage fallback');
}

// AsyncStorage fallback implementation
const asyncStorageAdapter: StorageAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    return AsyncStorage.getItem(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    await AsyncStorage.setItem(key, value);
  },
  removeItem: async (key: string): Promise<void> => {
    await AsyncStorage.removeItem(key);
  },
};

// Export the best available storage adapter
const storage: StorageAdapter = mmkvStorage ?? asyncStorageAdapter;

/**
 * Get an item from storage
 * @param key - Storage key
 * @returns Value or null if not found
 */
export const getItem = storage.getItem;

/**
 * Set an item in storage
 * @param key - Storage key
 * @param value - Value to store
 */
export const setItem = storage.setItem;

/**
 * Remove an item from storage
 * @param key - Storage key
 */
export const removeItem = storage.removeItem;

// Export storage keys for consistency
export const STORAGE_KEYS = {
  INSTANCE_URL: 'instance_url',
} as const;

export default storage;

