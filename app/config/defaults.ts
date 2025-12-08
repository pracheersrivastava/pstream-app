/**
 * Default configuration values for the pstream app.
 * These can be overridden at runtime via Settings.
 */

/**
 * Default P-Stream instance URL.
 * Users can change this in Settings to use a different instance.
 * Set to '__MOCK__' to enable mock mode by default.
 */
export const DEFAULT_INSTANCE = 'https://pstream.example.com';

/**
 * API request timeout in milliseconds
 */
export const API_TIMEOUT = 15000;

/**
 * Number of retry attempts for failed network requests
 */
export const API_RETRY_COUNT = 1;

/**
 * Client identifier sent with all API requests
 */
export const CLIENT_IDENTIFIER = 'pstream-app';

/**
 * Mock mode identifier - when instance URL is this value, use mock data
 */
export const MOCK_INSTANCE_IDENTIFIER = '__MOCK__';

