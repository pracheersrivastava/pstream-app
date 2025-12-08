/**
 * @format
 * Unit tests for SettingsService
 */

import {
  getInstanceUrl,
  setInstanceUrl,
  validateInstanceUrl,
  resetInstanceUrl,
} from '../services/SettingsService';
import { DEFAULT_INSTANCE } from '../config/defaults';

// Mock storage
jest.mock('../store/storage', () => {
  let storage: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => Promise.resolve(storage[key] ?? null)),
    setItem: jest.fn((key: string, value: string) => {
      storage[key] = value;
      return Promise.resolve();
    }),
    removeItem: jest.fn((key: string) => {
      delete storage[key];
      return Promise.resolve();
    }),
    STORAGE_KEYS: {
      INSTANCE_URL: 'instance_url',
      MOCK_MODE: 'mock_mode',
    },
    // Helper to reset storage between tests
    __resetStorage: () => {
      storage = {};
    },
  };
});

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn(),
  isAxiosError: jest.fn((error) => error?.isAxiosError === true),
}));

import axios from 'axios';
import * as storage from '../store/storage';

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedStorage = storage as jest.Mocked<typeof storage> & {
  __resetStorage: () => void;
};

describe('SettingsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedStorage.__resetStorage();
  });

  describe('getInstanceUrl', () => {
    it('returns DEFAULT_INSTANCE when no URL is saved', async () => {
      const url = await getInstanceUrl();
      expect(url).toBe(DEFAULT_INSTANCE);
    });

    it('returns saved URL when one exists', async () => {
      const savedUrl = 'https://custom.pstream.com';
      await mockedStorage.setItem('instance_url', savedUrl);

      const url = await getInstanceUrl();
      expect(url).toBe(savedUrl);
    });
  });

  describe('setInstanceUrl', () => {
    it('saves the URL to storage', async () => {
      const newUrl = 'https://new.pstream.com';
      await setInstanceUrl(newUrl);

      expect(mockedStorage.setItem).toHaveBeenCalledWith('instance_url', newUrl);
    });

    it('removes trailing slashes from URL', async () => {
      const urlWithSlash = 'https://new.pstream.com///';
      await setInstanceUrl(urlWithSlash);

      expect(mockedStorage.setItem).toHaveBeenCalledWith(
        'instance_url',
        'https://new.pstream.com',
      );
    });
  });

  describe('validateInstanceUrl', () => {
    it('returns true for valid response with items array', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        status: 200,
        data: { items: [] },
      });

      const isValid = await validateInstanceUrl('https://valid.pstream.com');
      expect(isValid).toBe(true);
    });

    it('returns true for valid array response', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        status: 200,
        data: [],
      });

      const isValid = await validateInstanceUrl('https://valid.pstream.com');
      expect(isValid).toBe(true);
    });

    it('returns false for non-200 status', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        status: 500,
        data: { items: [] },
      });

      const isValid = await validateInstanceUrl('https://invalid.pstream.com');
      expect(isValid).toBe(false);
    });

    it('returns false for invalid response structure', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        status: 200,
        data: { foo: 'bar' },
      });

      const isValid = await validateInstanceUrl('https://invalid.pstream.com');
      expect(isValid).toBe(false);
    });

    it('returns false on network error', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));

      const isValid = await validateInstanceUrl('https://unreachable.pstream.com');
      expect(isValid).toBe(false);
    });

    it('returns false on timeout', async () => {
      const timeoutError = new Error('timeout') as Error & { code?: string; isAxiosError?: boolean };
      timeoutError.code = 'ECONNABORTED';
      timeoutError.isAxiosError = true;
      mockedAxios.get.mockRejectedValueOnce(timeoutError);
      mockedAxios.isAxiosError.mockReturnValueOnce(true);

      const isValid = await validateInstanceUrl('https://slow.pstream.com');
      expect(isValid).toBe(false);
    });
  });

  describe('resetInstanceUrl', () => {
    it('resets URL to DEFAULT_INSTANCE', async () => {
      await setInstanceUrl('https://custom.pstream.com');
      await resetInstanceUrl();

      expect(mockedStorage.setItem).toHaveBeenLastCalledWith(
        'instance_url',
        DEFAULT_INSTANCE,
      );
    });
  });
});

