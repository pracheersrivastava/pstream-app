/**
 * GET /sources - Streaming sources passthrough
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
 * Request: GET /sources?tmdbId=<id>&type=<movie|tv>
 * Response: Available streaming sources for the media item
 *
 * Query Parameters:
 * - tmdbId (required): TMDB ID of the media
 * - type (optional): Media type ('movie' or 'tv'), defaults to 'movie'
 *
 * Note: The returned source URLs may point to streaming endpoints on this proxy
 * (e.g., /m3u8, /ts). The app should use those URLs directly with the video player.
 */

import { defineEventHandler } from 'h3';
import { forwardToBackend } from '../utils/backend';

export default defineEventHandler(async (event) => {
  // Forward to internal backend /sources endpoint
  // Query params (tmdbId, type) are preserved by forwardToBackend
  return forwardToBackend(event, '/sources');
});

