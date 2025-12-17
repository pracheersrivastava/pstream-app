/**
 * Default configuration values for the pstream app.
 *
 * SECURITY NOTICE:
 * This app NEVER communicates with the backend (port 3000) in any form.
 * All network traffic MUST go through the proxy (port 3003) ONLY.
 * Direct backend access is forbidden and will be rejected at runtime.
 */

/**
 * Base API URL - the ONLY entry point for all network traffic.
 * This points to the PROXY server, NOT the backend.
 *
 * INVARIANT: Port 3003 is the proxy. Port 3000 is the backend.
 * The app MUST ONLY communicate with the proxy.
 */
// For Android emulator: 10.0.2.2 maps to host machine's localhost
// For production: use 'http://129.159.231.53:3003'
export const BASE_API_URL = 'http://10.0.2.2:3003';

/**
 * Forbidden port - direct backend access is blocked at runtime.
 * Any request attempting to reach this port will be rejected.
 */
export const FORBIDDEN_BACKEND_PORT = 3000;

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

