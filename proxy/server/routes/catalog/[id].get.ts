/**
 * GET /catalog/:id - Catalog item details passthrough
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
 * Request: GET /catalog/:id
 * Response: Detailed metadata for the specified media item
 *
 * Path Parameters:
 * - id (required): Media item ID (TMDB ID or internal ID)
 */

import { defineEventHandler, getRouterParam, createError } from 'h3';
import { forwardToBackendWithParams } from '../../utils/backend';

export default defineEventHandler(async (event) => {
  // Extract the id path parameter
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Missing required parameter: id',
    });
  }

  // Forward to internal backend /catalog/:id endpoint
  return forwardToBackendWithParams(event, `/catalog/${id}`);
});

