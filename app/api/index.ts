/**
 * API module entry point.
 * Re-exports all API-related functions and types.
 */

// Types
export * from './types';

// Error utilities
export * from './errors';

// API client
export { createApiClient, getApiClient, get, post } from './client';

// P-Stream adapter
export {
  fetchHome,
  search,
  fetchDetails,
  fetchSources,
  setMockMode,
} from './pstream';

