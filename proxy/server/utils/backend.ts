/**
 * Backend Proxy Utility
 *
 * ============================================================================
 * SECURITY NOTICE (NON-NEGOTIABLE):
 * ============================================================================
 * This utility forwards requests to the INTERNAL backend.
 * The backend address is NEVER exposed to clients.
 * Only explicitly approved routes may use this utility.
 *
 * FORBIDDEN: Generic catch-all forwarding.
 * REQUIRED: Each route must explicitly call this utility.
 * ============================================================================
 */

import { H3Event, createError, getQuery, getHeader } from 'h3';

/**
 * Headers that should NOT be forwarded between hops.
 * These are connection-specific and must be stripped.
 */
const HOP_BY_HOP_HEADERS = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailers',
  'transfer-encoding',
  'upgrade',
  'host', // We replace this with backend host
]);

/**
 * Get the internal backend URL from runtime config.
 * This URL is NEVER exposed to clients.
 */
function getBackendUrl(): string {
  const config = useRuntimeConfig();
  return config.backendInternalUrl || 'http://127.0.0.1:3000';
}

/**
 * Filter headers to remove hop-by-hop headers.
 * @param headers - Original headers object
 * @returns Filtered headers safe for forwarding
 */
function filterHeaders(headers: Record<string, string | undefined>): Record<string, string> {
  const filtered: Record<string, string> = {};

  for (const [key, value] of Object.entries(headers)) {
    const lowerKey = key.toLowerCase();
    if (!HOP_BY_HOP_HEADERS.has(lowerKey) && value !== undefined) {
      filtered[key] = value;
    }
  }

  return filtered;
}

/**
 * Extract relevant headers from the incoming request.
 * @param event - H3 event object
 * @returns Headers object for forwarding
 */
function extractForwardHeaders(event: H3Event): Record<string, string> {
  const relevantHeaders: Record<string, string | undefined> = {
    'accept': getHeader(event, 'accept'),
    'accept-language': getHeader(event, 'accept-language'),
    'content-type': getHeader(event, 'content-type'),
    'x-pstream-client': getHeader(event, 'x-pstream-client'),
  };

  return filterHeaders(relevantHeaders);
}

/**
 * Forward a GET request to the internal backend.
 *
 * SECURITY: This function is the controlled gateway to the backend.
 * Only explicitly approved routes should call this function.
 *
 * @param event - H3 event from the incoming request
 * @param backendPath - The path to forward to (e.g., '/home', '/search')
 * @returns Response data from the backend
 * @throws H3Error if backend is unreachable or returns an error
 */
export async function forwardToBackend<T = unknown>(
  event: H3Event,
  backendPath: string,
): Promise<T> {
  const backendUrl = getBackendUrl();
  const query = getQuery(event);
  const headers = extractForwardHeaders(event);

  // Build the full backend URL with query params
  const url = new URL(backendPath, backendUrl);
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  }

  const targetUrl = url.toString();

  // Log in development (sanitized - no full URL in production)
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[Proxy] Forwarding: GET ${backendPath}`);
  }

  try {
    const response = await $fetch<T>(targetUrl, {
      method: 'GET',
      headers,
      // Disable automatic redirect following for security
      redirect: 'manual',
    });

    return response;
  } catch (error: unknown) {
    // Handle fetch errors
    if (error && typeof error === 'object' && 'response' in error) {
      const fetchError = error as { response?: { status?: number; _data?: unknown } };
      const status = fetchError.response?.status || 502;
      const data = fetchError.response?._data;

      // Propagate backend error status and body as-is
      // But DO NOT leak backend URL or internal details
      throw createError({
        statusCode: status,
        statusMessage: status >= 500 ? 'Backend Error' : 'Request Failed',
        data: data,
      });
    }

    // Network error - backend unreachable
    // Return controlled proxy-level error (no backend internals leaked)
    console.error('[Proxy] Backend unreachable');
    throw createError({
      statusCode: 502,
      statusMessage: 'Bad Gateway',
      message: 'Unable to reach upstream service',
    });
  }
}

/**
 * Forward a GET request with path parameters to the internal backend.
 *
 * @param event - H3 event from the incoming request
 * @param backendPath - The path template with params filled (e.g., '/catalog/123')
 * @returns Response data from the backend
 */
export async function forwardToBackendWithParams<T = unknown>(
  event: H3Event,
  backendPath: string,
): Promise<T> {
  // This is the same as forwardToBackend, but semantically indicates path params are expected
  return forwardToBackend<T>(event, backendPath);
}

