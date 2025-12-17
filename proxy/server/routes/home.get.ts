/**
 * GET /home - Home page metadata passthrough
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
 * Request: GET /home
 * Response: Home page content (trending, popular, etc.)
 */

import { defineEventHandler } from 'h3';
import { forwardToBackend } from '../utils/backend';

export default defineEventHandler(async (event) => {
  // Forward to internal backend /home endpoint
  return forwardToBackend(event, '/home');
});

