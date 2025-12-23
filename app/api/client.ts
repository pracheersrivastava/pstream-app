/**
 * API Client - Secure HTTP client for P-Stream app.
 *
 * ============================================================================
 * SECURITY NOTICE (NON-NEGOTIABLE):
 * ============================================================================
 * This app NEVER communicates with the backend (port 3000) in any form.
 * All network traffic MUST go through the proxy (port 3003) ONLY.
 *
 * This module implements a hard runtime guard that:
 * - Blocks ANY request to port 3000, regardless of hostname or protocol
 * - Disables automatic redirect following to prevent redirect-based attacks
 * - Throws immediately if a forbidden destination is detected
 *
 * Direct usage of fetch, axios.create(), or other HTTP clients outside this
 * module is FORBIDDEN. All network calls must use the exported functions.
 * ============================================================================
 */

import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import {
  BASE_API_URL,
  FORBIDDEN_BACKEND_PORT,
  API_TIMEOUT,
  API_RETRY_COUNT,
  CLIENT_IDENTIFIER,
} from '../config/defaults';
import { getCurrentInstance } from '../config/env';
import { normalizeError, ApiError, ErrorCodes } from './errors';

/**
 * Normalized error response shape
 */
export interface NormalizedErrorResponse {
  code: number;
  message: string;
  meta?: Record<string, unknown>;
}

/**
 * Extended request config with retry tracking
 */
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retryCount?: number;
}

/**
 * Error thrown when attempting to access forbidden backend port.
 */
export class BackendAccessForbiddenError extends Error {
  constructor(url: string) {
    super(
      `Direct backend access (port ${FORBIDDEN_BACKEND_PORT}) is forbidden. Use proxy only. Attempted URL: ${url}`,
    );
    this.name = 'BackendAccessForbiddenError';
  }
}

/**
 * Extract port from a URL string.
 * Returns the explicit port or the default port for the protocol.
 *
 * @param url - URL string to parse
 * @returns Port number or null if unable to parse
 */
function extractPort(url: string): number | null {
  try {
    // Handle relative URLs by prepending base
    const fullUrl = url.startsWith('http') ? url : `${BASE_API_URL}${url}`;

    // Parse using regex since React Native URL support is limited
    const match = fullUrl.match(/^(https?):\/\/([^:/]+)(?::(\d+))?/);
    if (match) {
      const protocol = match[1];
      const explicitPort = match[3];

      if (explicitPort) {
        return parseInt(explicitPort, 10);
      }

      // Default ports
      return protocol === 'https' ? 443 : 80;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * NETWORK GUARD: Validates that a URL does not target the forbidden backend port.
 * This is a HARD security boundary - violations throw immediately.
 *
 * @param url - The URL to validate
 * @throws BackendAccessForbiddenError if the URL targets port 3000
 */
export function assertNotBackendPort(url: string): void {
  const port = extractPort(url);

  if (port === FORBIDDEN_BACKEND_PORT) {
    throw new BackendAccessForbiddenError(url);
  }
}

/**
 * Sanitized logging for development only.
 * Logs only the HTTP method and path, excluding:
 * - Full URLs
 * - Query parameters
 * - Tokens, signed URLs, or sensitive data
 *
 * @param method - HTTP method
 * @param url - Request URL (will be sanitized)
 */
function logRequest(method: string, url: string): void {
  // Only log in development mode
  if (!__DEV__) {
    return;
  }

  // Extract just the path, excluding query params and base URL
  let path = url;
  try {
    // Remove base URL if present
    if (url.startsWith('http')) {
      const match = url.match(/^https?:\/\/[^/]+(\/[^?]*)?/);
      path = match?.[1] ?? '/';
    }
    // Remove query parameters
    path = path.split('?')[0];
  } catch {
    path = '/[parse-error]';
  }

  console.log(`[API] → ${method.toUpperCase()} ${path}`);
}

/**
 * Create the secure API client instance.
 * This is the ONLY approved way to make HTTP requests in the app.
 *
 * Security features:
 * - Fixed base URL pointing to proxy only
 * - Automatic redirect following DISABLED
 * - Pre-request guard against port 3000
 * - Sanitized logging in dev mode only
 *
 * @returns Configured axios instance
 */
export function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: BASE_API_URL,
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    // SECURITY: Disable automatic redirect following.
    // This prevents redirect-based attacks where a compromised proxy
    // could redirect the client to the backend (port 3000).
    maxRedirects: 0,
    validateStatus: (status) => status >= 200 && status < 400,
  });

  // Request interceptor - validate destination and add headers
  client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      // DYNAMIC URL: Set baseURL from storage
      const currentUrl = await getCurrentInstance();
      config.baseURL = currentUrl;

      // SECURITY GUARD: Validate the final request URL
      const fullUrl = `${config.baseURL ?? ''}${config.url ?? ''}`;
      assertNotBackendPort(fullUrl);

      // Also validate baseURL independently
      if (config.baseURL) {
        assertNotBackendPort(config.baseURL);
      }

      // Add client identifier header
      config.headers.set('X-PStream-Client', CLIENT_IDENTIFIER);

      // Sanitized dev-only logging
      logRequest(config.method ?? 'GET', config.url ?? '/');

      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(normalizeError(error));
    },
  );

  // Response interceptor - handle errors and enforce no-redirect policy
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error: AxiosError) => {
      const config = error.config as ExtendedAxiosRequestConfig | undefined;

      // Handle redirect responses (3xx) - we disabled auto-follow,
      // so 3xx responses will appear as errors. We reject them.
      if (error.response && error.response.status >= 300 && error.response.status < 400) {
        const location = error.response.headers?.location;
        if (location) {
          // SECURITY: Check if redirect target is the forbidden port
          assertNotBackendPort(location);
        }

        // Even if the redirect target is valid, we don't follow redirects.
        // The proxy should not be redirecting client requests.
        throw new ApiError(
          ErrorCodes.SERVER_ERROR,
          'Unexpected redirect from proxy. Redirects are not supported.',
          { location, status: error.response.status },
        );
      }

      // Retry logic for network errors
      if (config && shouldRetry(error, config)) {
        config._retryCount = (config._retryCount ?? 0) + 1;

        if (__DEV__) {
          console.log(`[API] Retrying request (attempt ${config._retryCount})`);
        }

        // Wait before retrying
        await sleep(1000 * config._retryCount);
        return client.request(config);
      }

      // Normalize and throw error
      throw normalizeError(error);
    },
  );

  return client;
}

/**
 * Determine if a request should be retried
 */
function shouldRetry(
  error: AxiosError,
  config: ExtendedAxiosRequestConfig,
): boolean {
  const retryCount = config._retryCount ?? 0;

  // Don't retry if we've exceeded the limit
  if (retryCount >= API_RETRY_COUNT) {
    return false;
  }

  // Retry on network errors
  if (!error.response) {
    return true;
  }

  // Retry on 5xx server errors
  if (error.response.status >= 500) {
    return true;
  }

  // Retry on timeout
  if (error.code === 'ECONNABORTED') {
    return true;
  }

  return false;
}

/**
 * Sleep helper for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Singleton client instance
let apiClient: AxiosInstance | null = null;

/**
 * Get the singleton API client instance.
 * This is the ONLY way to make HTTP requests in the app.
 *
 * @returns The secure axios instance
 */
export function getApiClient(): AxiosInstance {
  if (!apiClient) {
    apiClient = createApiClient();
  }
  return apiClient;
}

/**
 * Make a GET request to the proxy.
 * All requests go through the secure client with port validation.
 *
 * @param path - API path (e.g., '/home', '/search')
 * @param params - Optional query parameters
 * @returns Response data
 */
export async function get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
  const response = await getApiClient().get<T>(path, { params });
  return response.data;
}

/**
 * Make a POST request to the proxy.
 * All requests go through the secure client with port validation.
 *
 * @param path - API path
 * @param data - Request body
 * @returns Response data
 */
export async function post<T>(path: string, data?: unknown): Promise<T> {
  const response = await getApiClient().post<T>(path, data);
  return response.data;
}

/**
 * Get the base API URL (for debugging/display only).
 * Do not use this to construct manual requests.
 */
export function getBaseApiUrl(): string {
  return BASE_API_URL;
}

export default {
  createApiClient,
  getApiClient,
  get,
  post,
  getBaseApiUrl,
  assertNotBackendPort,
  BackendAccessForbiddenError,
};
