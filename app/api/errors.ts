/**
 * API error handling utilities.
 * Provides typed errors and helper functions.
 */

/**
 * Custom API error class with typed properties
 */
export class ApiError extends Error {
  /** HTTP status code or custom error code */
  code: number;
  /** Additional metadata about the error */
  meta?: Record<string, unknown>;

  constructor(code: number, message: string, meta?: Record<string, unknown>) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.meta = meta;

    // Maintains proper stack trace for where error was thrown (V8 engines)
    const errorConstructor = Error as typeof Error & {
      captureStackTrace?: (target: object, constructor: Function) => void;
    };
    if (errorConstructor.captureStackTrace) {
      errorConstructor.captureStackTrace(this, ApiError);
    }
  }
}

/**
 * Error codes for common API errors
 */
export const ErrorCodes = {
  /** Network connectivity issue */
  NETWORK_ERROR: -1,
  /** Request timed out */
  TIMEOUT: -2,
  /** Server returned invalid/unexpected response */
  INVALID_RESPONSE: -3,
  /** Mock mode - no real backend */
  MOCK_MODE: -4,
  /** Instance validation failed */
  INVALID_INSTANCE: -5,
  /** Generic client error (4xx) */
  CLIENT_ERROR: 400,
  /** Unauthorized */
  UNAUTHORIZED: 401,
  /** Forbidden */
  FORBIDDEN: 403,
  /** Not found */
  NOT_FOUND: 404,
  /** Server error (5xx) */
  SERVER_ERROR: 500,
} as const;

/**
 * Check if an error is a network-related error
 * @param error - Error to check
 * @returns True if the error is network-related
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return (
      error.code === ErrorCodes.NETWORK_ERROR ||
      error.code === ErrorCodes.TIMEOUT
    );
  }

  // Check for axios network errors
  if (error && typeof error === 'object') {
    const err = error as { code?: string; message?: string };
    const isConnAborted = err.code === 'ECONNABORTED';
    const isNetworkErr = err.code === 'ERR_NETWORK';
    const hasNetworkMessage = err.message?.includes('Network Error') ?? false;
    const hasTimeoutMessage = err.message?.includes('timeout') ?? false;

    return isConnAborted || isNetworkErr || hasNetworkMessage || hasTimeoutMessage;
  }

  return false;
}

/**
 * Check if an error is an API error
 * @param error - Error to check
 * @returns True if the error is an ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Create an ApiError from various error types
 * @param error - Original error
 * @returns Normalized ApiError
 */
export function normalizeError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error && typeof error === 'object') {
    const err = error as {
      response?: { status?: number; data?: { message?: string } };
      code?: string;
      message?: string;
    };

    // Axios error with response
    if (err.response) {
      return new ApiError(
        err.response.status ?? ErrorCodes.SERVER_ERROR,
        err.response.data?.message ?? 'Server error',
        { originalError: error },
      );
    }

    // Network/timeout error
    if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
      return new ApiError(ErrorCodes.TIMEOUT, 'Request timed out', {
        originalError: error,
      });
    }

    if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
      return new ApiError(
        ErrorCodes.NETWORK_ERROR,
        'Network error - check your connection',
        { originalError: error },
      );
    }

    // Generic error with message
    if (err.message) {
      return new ApiError(ErrorCodes.SERVER_ERROR, err.message, {
        originalError: error,
      });
    }
  }

  return new ApiError(
    ErrorCodes.SERVER_ERROR,
    'An unexpected error occurred',
    { originalError: error },
  );
}

