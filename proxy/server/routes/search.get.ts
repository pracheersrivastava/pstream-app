/**
 * GET /search - Search metadata passthrough
 *
 * ============================================================================
 * SECURITY NOTICE:
 * ============================================================================
 * This route forwards requests to the internal backend.
 * The backend address is NEVER exposed to the client.
 * This is an explicitly approved metadata route.
 * ============================================================================
 *
 * Flow: App → Proxy (this route) → Backend → Response → App
 *
 * Request: GET /search?q=<query>
 * Response: Search results matching the query
 *
 * Query Parameters:
 * - q (required): Search query string
 */

import { defineEventHandler } from 'h3';
import { forwardToBackend } from '../utils/backend';

export default defineEventHandler(async (event) => {
  // Forward to internal backend /search endpoint
  // Query params (q) are preserved by forwardToBackend
  return forwardToBackend(event, '/search');
});

