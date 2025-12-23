/**
 * @format
 * Unit tests for SettingsService
 */

import axios from 'axios';
import {
  getInstanceUrl,
  setInstanceUrl,
  validateInstanceUrl,
  resetInstanceUrl,
} from '../services/SettingsService';
import { BASE_API_URL } from '../config/defaults';
import { STORAGE_KEYS } from '../store/storage';

// Mock storage
const mockSetItem = jest.fn();
const mockGetItem = jest.fn();
const mockRemoveItem = jest.fn();

jest.mock('../store/storage', () => ({
  getItem: (...args: any[]) => mockGetItem(...args),
  setItem: (...args: any[]) => mockSetItem(...args),
  removeItem: (...args: any[]) => mockRemoveItem(...args),
  STORAGE_KEYS: {
    INSTANCE_URL: 'instance_url',
  },
}));

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('SettingsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getInstanceUrl', () => {
    it('returns stored URL if available', async () => {
      mockGetItem.mockResolvedValue('http://custom-proxy:3003');
      const result = await getInstanceUrl();
      expect(result).toBe('http://custom-proxy:3003');
    });

    it('returns BASE_API_URL if storage is empty', async () => {
      mockGetItem.mockResolvedValue(null);
      const result = await getInstanceUrl();
      expect(result).toBe(BASE_API_URL);
    });
  });

  describe('setInstanceUrl', () => {
    it('saves normalized URL to storage', async () => {
      await setInstanceUrl('http://new-proxy:3003/');
      expect(mockSetItem).toHaveBeenCalledWith(
        STORAGE_KEYS.INSTANCE_URL,
        'http://new-proxy:3003'
      );
    });
  });

  describe('validateInstanceUrl', () => {
    it('returns false if URL contains port 3000', async () => {
      const result = await validateInstanceUrl('http://10.0.2.2:3000');
      expect(result).toBe(false);
    });

    it('returns true if /meta endpoint returns 200', async () => {
      mockedAxios.get.mockResolvedValueOnce({ status: 200 });
      const result = await validateInstanceUrl('http://valid-proxy:3003');
      expect(result).toBe(true);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://valid-proxy:3003/meta',
        expect.any(Object)
      );
    });

    it('returns true if /ping endpoint returns 200 (fallback)', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('404'));
      mockedAxios.get.mockResolvedValueOnce({ status: 200 });
      
      const result = await validateInstanceUrl('http://valid-proxy:3003');
      expect(result).toBe(true);
      expect(mockedAxios.get).toHaveBeenCalledTimes(2);
      expect(mockedAxios.get).toHaveBeenLastCalledWith(
        'http://valid-proxy:3003/ping',
        expect.any(Object)
      );
    });

    it('returns false if both endpoints fail', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network Error'));
      
      const result = await validateInstanceUrl('http://invalid-proxy:3003');
      expect(result).toBe(false);
    });
  });

  describe('resetInstanceUrl', () => {
    it('removes instance URL from storage', async () => {
      await resetInstanceUrl();
      expect(mockRemoveItem).toHaveBeenCalledWith(STORAGE_KEYS.INSTANCE_URL);
    });
  });
});
