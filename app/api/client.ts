/**
 * API Client Factory
 * Creates axios instances that dynamically read baseURL from settings.
 * Includes interceptors for headers, error handling, and retry logic.
 */
import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { getInstanceUrl } from '../services/SettingsService';
import {
  API_TIMEOUT,
  API_RETRY_COUNT,
  CLIENT_IDENTIFIER,
} from '../config/defaults';
import { normalizeError } from './errors';

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
 * Create an axios instance with P-Stream configuration.
 * The instance reads baseURL dynamically on each request.
 *
 * @returns Configured axios instance
 */
export function createApiClient(): AxiosInstance {
  const client = axios.create({
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  // Request interceptor - set baseURL dynamically and add headers
  client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      // Dynamically get the current instance URL for each request
      const instanceUrl = await getInstanceUrl();
      config.baseURL = instanceUrl;

      // Add custom headers
      config.headers.set('X-PStream-Client', CLIENT_IDENTIFIER);
      config.headers.set('X-Request-Timestamp', new Date().toISOString());

      console.log(
        `[API] ${config.method?.toUpperCase()} ${instanceUrl}${config.url}`,
      );

      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(normalizeError(error));
    },
  );

  // Response interceptor - handle errors and normalize response
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error: AxiosError) => {
      const config = error.config as ExtendedAxiosRequestConfig | undefined;

      // Retry logic for network errors
      if (config && shouldRetry(error, config)) {
        config._retryCount = (config._retryCount ?? 0) + 1;
        console.log(`[API] Retrying request (attempt ${config._retryCount})`);

        // Wait a bit before retrying
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

// Default client instance
let defaultClient: AxiosInstance | null = null;

/**
 * Get the default API client instance.
 * Creates one if it doesn't exist.
 *
 * @returns The default axios instance
 */
export function getApiClient(): AxiosInstance {
  if (!defaultClient) {
    defaultClient = createApiClient();
  }
  return defaultClient;
}

/**
 * Make a GET request using the default client
 */
export async function get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const response = await getApiClient().get<T>(url, { params });
  return response.data;
}

/**
 * Make a POST request using the default client
 */
export async function post<T>(url: string, data?: unknown): Promise<T> {
  const response = await getApiClient().post<T>(url, data);
  return response.data;
}

export default {
  createApiClient,
  getApiClient,
  get,
  post,
};

