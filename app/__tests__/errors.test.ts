/**
 * @format
 * Unit tests for API error utilities
 */

import {
  ApiError,
  ErrorCodes,
  isNetworkError,
  isApiError,
  normalizeError,
} from '../api/errors';

describe('API Errors', () => {
  describe('ApiError', () => {
    it('creates an error with code and message', () => {
      const error = new ApiError(404, 'Not found');

      expect(error.code).toBe(404);
      expect(error.message).toBe('Not found');
      expect(error.name).toBe('ApiError');
    });

    it('includes optional meta data', () => {
      const meta = { endpoint: '/test' };
      const error = new ApiError(500, 'Server error', meta);

      expect(error.meta).toEqual(meta);
    });

    it('is an instance of Error', () => {
      const error = new ApiError(400, 'Bad request');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ApiError);
    });
  });

  describe('isNetworkError', () => {
    it('returns true for ApiError with NETWORK_ERROR code', () => {
      const error = new ApiError(ErrorCodes.NETWORK_ERROR, 'Network error');
      expect(isNetworkError(error)).toBe(true);
    });

    it('returns true for ApiError with TIMEOUT code', () => {
      const error = new ApiError(ErrorCodes.TIMEOUT, 'Request timed out');
      expect(isNetworkError(error)).toBe(true);
    });

    it('returns false for other ApiError codes', () => {
      const error = new ApiError(404, 'Not found');
      expect(isNetworkError(error)).toBe(false);
    });

    it('returns true for error with ECONNABORTED code', () => {
      const error = { code: 'ECONNABORTED', message: 'timeout' };
      expect(isNetworkError(error)).toBe(true);
    });

    it('returns true for error with ERR_NETWORK code', () => {
      const error = { code: 'ERR_NETWORK', message: 'Network Error' };
      expect(isNetworkError(error)).toBe(true);
    });

    it('returns true for error with Network Error message', () => {
      const error = { message: 'Network Error occurred' };
      expect(isNetworkError(error)).toBe(true);
    });

    it('returns false for null', () => {
      expect(isNetworkError(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isNetworkError(undefined)).toBe(false);
    });

    it('returns false for regular errors', () => {
      const error = new Error('Some error');
      expect(isNetworkError(error)).toBe(false);
    });
  });

  describe('isApiError', () => {
    it('returns true for ApiError instances', () => {
      const error = new ApiError(400, 'Bad request');
      expect(isApiError(error)).toBe(true);
    });

    it('returns false for regular Error instances', () => {
      const error = new Error('Regular error');
      expect(isApiError(error)).toBe(false);
    });

    it('returns false for plain objects', () => {
      const error = { code: 400, message: 'Bad request' };
      expect(isApiError(error)).toBe(false);
    });
  });

  describe('normalizeError', () => {
    it('returns ApiError as-is', () => {
      const error = new ApiError(404, 'Not found');
      const normalized = normalizeError(error);

      expect(normalized).toBe(error);
    });

    it('normalizes axios error with response', () => {
      const axiosError = {
        response: {
          status: 500,
          data: { message: 'Internal server error' },
        },
      };

      const normalized = normalizeError(axiosError);

      expect(normalized).toBeInstanceOf(ApiError);
      expect(normalized.code).toBe(500);
      expect(normalized.message).toBe('Internal server error');
    });

    it('normalizes timeout error', () => {
      const timeoutError = {
        code: 'ECONNABORTED',
        message: 'timeout of 15000ms exceeded',
      };

      const normalized = normalizeError(timeoutError);

      expect(normalized).toBeInstanceOf(ApiError);
      expect(normalized.code).toBe(ErrorCodes.TIMEOUT);
      expect(normalized.message).toBe('Request timed out');
    });

    it('normalizes network error', () => {
      const networkError = {
        code: 'ERR_NETWORK',
        message: 'Network Error',
      };

      const normalized = normalizeError(networkError);

      expect(normalized).toBeInstanceOf(ApiError);
      expect(normalized.code).toBe(ErrorCodes.NETWORK_ERROR);
    });

    it('normalizes error with just message', () => {
      const error = { message: 'Something went wrong' };

      const normalized = normalizeError(error);

      expect(normalized).toBeInstanceOf(ApiError);
      expect(normalized.message).toBe('Something went wrong');
    });

    it('handles unknown error types', () => {
      const normalized = normalizeError('string error');

      expect(normalized).toBeInstanceOf(ApiError);
      expect(normalized.code).toBe(ErrorCodes.SERVER_ERROR);
      expect(normalized.message).toBe('An unexpected error occurred');
    });

    it('preserves original error in meta', () => {
      const original = { message: 'Original error' };
      const normalized = normalizeError(original);

      expect(normalized.meta?.originalError).toBe(original);
    });
  });
});

