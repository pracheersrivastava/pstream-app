/**
 * Nitro Configuration for P-Stream Proxy
 *
 * This proxy is the ONLY entry point for the mobile app.
 * All metadata requests are forwarded to the internal backend.
 * The backend is NEVER exposed to the client.
 */

export default defineNitroConfig({
  // Runtime config for environment-based configuration
  runtimeConfig: {
    // Internal backend URL - NEVER exposed to clients
    // Default to localhost:3000, override via NITRO_BACKEND_INTERNAL_URL
    backendInternalUrl: process.env.BACKEND_INTERNAL_URL || 'http://127.0.0.1:3000',
  },

  // Proxy server port
  devServer: {
    port: 3003,
  },

  // Enable source maps in development
  sourcemap: process.env.NODE_ENV !== 'production',
});

