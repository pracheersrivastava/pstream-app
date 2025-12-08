/**
 * @format
 * Unit tests for API client factory
 */

import { createApiClient } from '../api/client';
import { CLIENT_IDENTIFIER } from '../config/defaults';

// Mock SettingsService
jest.mock('../services/SettingsService', () => ({
  getInstanceUrl: jest.fn(() => Promise.resolve('https://test.pstream.com')),
}));

// Mock axios
jest.mock('axios', () => {
  const mockAxiosInstance = {
    get: jest.fn(),
    post: jest.fn(),
    interceptors: {
      request: {
        use: jest.fn(),
      },
      response: {
        use: jest.fn(),
      },
    },
    defaults: {
      headers: {
        common: {},
      },
    },
  };

  return {
    create: jest.fn(() => mockAxiosInstance),
    isAxiosError: jest.fn(),
  };
});

import axios from 'axios';
import { getInstanceUrl } from '../services/SettingsService';

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedGetInstanceUrl = getInstanceUrl as jest.MockedFunction<typeof getInstanceUrl>;

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createApiClient', () => {
    it('creates an axios instance with correct config', () => {
      createApiClient();

      expect(mockedAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          timeout: 15000,
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }),
        }),
      );
    });

    it('registers request interceptor', () => {
      createApiClient();
      const mockInstance = mockedAxios.create.mock.results[0]?.value;

      expect(mockInstance.interceptors.request.use).toHaveBeenCalled();
    });

    it('registers response interceptor', () => {
      createApiClient();
      const mockInstance = mockedAxios.create.mock.results[0]?.value;

      expect(mockInstance.interceptors.response.use).toHaveBeenCalled();
    });
  });

  describe('getApiClient', () => {
    it('returns the same instance on multiple calls', () => {
      // Reset the module to clear cached client
      jest.resetModules();

      // Re-import after reset
      const { getApiClient: freshGetApiClient } = require('../api/client');

      const client1 = freshGetApiClient();
      const client2 = freshGetApiClient();

      // Should only create once
      expect(client1).toBe(client2);
      expect(client1).toBeTruthy();
    });
  });

  describe('request interceptor', () => {
    it('dynamically fetches instance URL', async () => {
      createApiClient();
      const mockInstance = mockedAxios.create.mock.results[0]?.value;

      // Get the request interceptor callback
      const requestInterceptor = mockInstance.interceptors.request.use.mock.calls[0]?.[0];

      if (requestInterceptor) {
        const mockConfig = {
          headers: {
            set: jest.fn(),
          },
          method: 'get',
          url: '/test',
        };

        await requestInterceptor(mockConfig);

        expect(mockedGetInstanceUrl).toHaveBeenCalled();
        expect(mockConfig.headers.set).toHaveBeenCalledWith(
          'X-PStream-Client',
          CLIENT_IDENTIFIER,
        );
        expect(mockConfig.headers.set).toHaveBeenCalledWith(
          'X-Request-Timestamp',
          expect.any(String),
        );
      }
    });
  });
});

