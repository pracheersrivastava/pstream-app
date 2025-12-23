/**
 * @format
 * Unit tests for API client - including proxy-only guard enforcement
 *
 * SECURITY TESTS: These tests verify that the app NEVER communicates
 * with the backend (port 3000) and ONLY uses the proxy (port 3003).
 */

import {
  createApiClient,
  assertNotBackendPort,
  BackendAccessForbiddenError,
  getBaseApiUrl,
} from '../api/client';
import { BASE_API_URL, CLIENT_IDENTIFIER, FORBIDDEN_BACKEND_PORT } from '../config/defaults';

// Mock axios
jest.mock('axios', () => {
  const mockAxiosInstance = {
    get: jest.fn(),
    post: jest.fn(),
    request: jest.fn(),
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

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Base URL Configuration', () => {
    it('uses the proxy URL (port 3003) as base URL', () => {
      expect(BASE_API_URL).toBe('http://10.0.2.2:3003');
      expect(getBaseApiUrl()).toBe('http://10.0.2.2:3003');
    });

    it('creates axios instance with proxy base URL', () => {
      createApiClient();

      expect(mockedAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: 'http://10.0.2.2:3003',
        }),
      );
    });

    it('disables automatic redirect following for security', () => {
      createApiClient();

      expect(mockedAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          maxRedirects: 0,
        }),
      );
    });
  });

  describe('Network Guard - assertNotBackendPort (SECURITY-CRITICAL)', () => {
    describe('should BLOCK requests to port 3000 (backend)', () => {
      const forbiddenUrls = [
        'http://10.0.2.2:3000/home',
        'http://10.0.2.2:3000/search?q=test',
        'http://10.0.2.2:3000/catalog/123',
        'http://10.0.2.2:3000/sources',
        'http://localhost:3000/api',
        'http://127.0.0.1:3000/backend/home',
        'https://10.0.2.2:3000/secure',
        'http://example.com:3000/test',
        // Edge cases
        'http://10.0.2.2:3000',
        'http://10.0.2.2:3000/',
      ];

      forbiddenUrls.forEach((url) => {
        it(`blocks: ${url}`, () => {
          expect(() => assertNotBackendPort(url)).toThrow(BackendAccessForbiddenError);
          expect(() => assertNotBackendPort(url)).toThrow(
            `Direct backend access (port ${FORBIDDEN_BACKEND_PORT}) is forbidden`,
          );
        });
      });
    });

    describe('should ALLOW requests to port 3003 (proxy)', () => {
      const allowedUrls = [
        'http://10.0.2.2:3003/home',
        'http://10.0.2.2:3003/search?q=test',
        'http://10.0.2.2:3003/catalog/123',
        'http://10.0.2.2:3003/sources',
        '/home',
        '/search',
        '/catalog/123',
        '/sources?tmdbId=123&type=movie',
      ];

      allowedUrls.forEach((url) => {
        it(`allows: ${url}`, () => {
          expect(() => assertNotBackendPort(url)).not.toThrow();
        });
      });
    });

    describe('should ALLOW other ports', () => {
      const otherPorts = [
        'http://example.com:80/api',
        'https://example.com:443/api',
        'http://localhost:8080/test',
        'http://192.168.1.1:5000/api',
        'http://example.com/api', // default port 80
        'https://example.com/api', // default port 443
      ];

      otherPorts.forEach((url) => {
        it(`allows: ${url}`, () => {
          expect(() => assertNotBackendPort(url)).not.toThrow();
        });
      });
    });
  });

  describe('Request Interceptor', () => {
    it('registers request interceptor', () => {
      createApiClient();
      const mockInstance = mockedAxios.create.mock.results[0]?.value;

      expect(mockInstance.interceptors.request.use).toHaveBeenCalled();
    });

    it('validates request URL in interceptor', async () => {
      createApiClient();
      const mockInstance = mockedAxios.create.mock.results[0]?.value;

      // Get the request interceptor callback
      const requestInterceptor = mockInstance.interceptors.request.use.mock.calls[0]?.[0];

      if (requestInterceptor) {
        // Valid proxy request should pass
        const validConfig = {
          baseURL: 'http://10.0.2.2:3003',
          url: '/home',
          headers: { set: jest.fn() },
          method: 'get',
        };

        const result = await requestInterceptor(validConfig);
        expect(result).toBe(validConfig);

        // Invalid backend request should throw
        const invalidConfig = {
          baseURL: 'http://10.0.2.2:3000',
          url: '/home',
          headers: { set: jest.fn() },
          method: 'get',
        };

        await expect(requestInterceptor(invalidConfig)).rejects.toThrow(
          BackendAccessForbiddenError,
        );
      }
    });

    it('adds client identifier header', async () => {
      createApiClient();
      const mockInstance = mockedAxios.create.mock.results[0]?.value;

      const requestInterceptor = mockInstance.interceptors.request.use.mock.calls[0]?.[0];

      if (requestInterceptor) {
        const mockConfig = {
          baseURL: 'http://10.0.2.2:3003',
          url: '/home',
          headers: { set: jest.fn() },
          method: 'get',
        };

        await requestInterceptor(mockConfig);

        expect(mockConfig.headers.set).toHaveBeenCalledWith(
          'X-PStream-Client',
          CLIENT_IDENTIFIER,
        );
      }
    });
  });

  describe('Response Interceptor', () => {
    it('registers response interceptor', () => {
      createApiClient();
      const mockInstance = mockedAxios.create.mock.results[0]?.value;

      expect(mockInstance.interceptors.response.use).toHaveBeenCalled();
    });
  });

  describe('getApiClient (Singleton)', () => {
    it('returns the same instance on multiple calls', () => {
      // Reset the module to clear cached client
      jest.resetModules();

      // Re-require after reset
      const { getApiClient: freshGetApiClient } = require('../api/client');

      const client1 = freshGetApiClient();
      const client2 = freshGetApiClient();

      expect(client1).toBe(client2);
    });
  });

  describe('BackendAccessForbiddenError', () => {
    it('has correct error name', () => {
      const error = new BackendAccessForbiddenError('http://test:3000');
      expect(error.name).toBe('BackendAccessForbiddenError');
    });

    it('includes the attempted URL in message', () => {
      const error = new BackendAccessForbiddenError('http://test:3000/api');
      expect(error.message).toContain('http://test:3000/api');
    });

    it('includes the forbidden port in message', () => {
      const error = new BackendAccessForbiddenError('http://test:3000');
      expect(error.message).toContain('port 3000');
      expect(error.message).toContain('forbidden');
      expect(error.message).toContain('proxy only');
    });
  });
});
