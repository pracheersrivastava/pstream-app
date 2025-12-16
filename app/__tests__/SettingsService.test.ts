/**
 * @format
 * Unit tests for SettingsService (deprecated service)
 *
 * Note: The SettingsService is deprecated. Instance URL changes are no longer
 * supported. The app uses a fixed BASE_API_URL (proxy at port 3003).
 */

import {
  getInstanceUrl,
  setInstanceUrl,
  validateInstanceUrl,
  resetInstanceUrl,
} from '../services/SettingsService';
import { BASE_API_URL } from '../config/defaults';

// Mock storage
jest.mock('../store/storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  STORAGE_KEYS: {
    INSTANCE_URL: 'instance_url',
    MOCK_MODE: 'mock_mode',
  },
}));

describe('SettingsService (Deprecated)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getInstanceUrl', () => {
    it('always returns BASE_API_URL (fixed proxy URL)', async () => {
      const result = await getInstanceUrl();
      expect(result).toBe(BASE_API_URL);
      expect(result).toBe('http://129.159.231.53:3003');
    });

    it('returns proxy URL (port 3003), not backend URL (port 3000)', async () => {
      const result = await getInstanceUrl();
      expect(result).toContain(':3003');
      expect(result).not.toContain(':3000');
    });
  });

  describe('setInstanceUrl', () => {
    it('is a no-op (deprecated)', async () => {
      // Should not throw
      await expect(setInstanceUrl('http://different.url:3003')).resolves.toBeUndefined();
    });
  });

  describe('validateInstanceUrl', () => {
    it('returns true for BASE_API_URL', async () => {
      const result = await validateInstanceUrl(BASE_API_URL);
      expect(result).toBe(true);
    });

    it('returns true for BASE_API_URL with trailing slash', async () => {
      const result = await validateInstanceUrl(`${BASE_API_URL}/`);
      expect(result).toBe(true);
    });

    it('returns false for any other URL', async () => {
      const result = await validateInstanceUrl('http://other.url:3003');
      expect(result).toBe(false);
    });

    it('returns false for backend URL (port 3000)', async () => {
      const result = await validateInstanceUrl('http://129.159.231.53:3000');
      expect(result).toBe(false);
    });
  });

  describe('resetInstanceUrl', () => {
    it('is a no-op (deprecated)', async () => {
      // Should not throw
      await expect(resetInstanceUrl()).resolves.toBeUndefined();
    });
  });
});
